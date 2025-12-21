// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use crate::common::IntentMessage;
use crate::common::{to_signed_response, IntentScope, ProcessDataRequest, ProcessedDataResponse};
use crate::AppState;
use crate::EnclaveError;
use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::info;

/// ====
/// Tinder app server logic.
/// This accepts a profile payload (matching Move's ProfileNFT fields) and
/// returns a signed IntentMessage<UserProfile>.
/// ====

/// Inner type for IntentMessage<T>
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserProfile {
	pub first_name: String,
	pub email: String,
	pub birthday_month: u64,
	pub birthday_day: u64,
	pub birthday_year: u64,
	pub gender: String,
	pub show_gender: bool,
	pub interested_in: String,
	pub relationship_intent: Vec<String>,
	pub interests: Vec<String>,
}

/// Inner type for ProcessDataRequest<T>
#[derive(Debug, Serialize, Deserialize)]
pub struct ProfileRequest {
	pub first_name: String,
	pub email: String,
	pub birthday_month: u64,
	pub birthday_day: u64,
	pub birthday_year: u64,
	pub gender: String,
	pub show_gender: bool,
	pub interested_in: String,
	pub relationship_intent: Vec<String>,
	pub interests: Vec<String>,
}

pub async fn process_data(
	State(state): State<Arc<AppState>>,
	Json(request): Json<ProcessDataRequest<ProfileRequest>>,
) -> Result<Json<ProcessedDataResponse<IntentMessage<UserProfile>>>, EnclaveError> {
	let payload = request.payload;
	info!("Processing tinder profile for: {}", payload.first_name);

	// Minimal validation: ensure required fields are present
	if payload.first_name.trim().is_empty() {
		return Err(EnclaveError::GenericError("first_name is required".to_string()));
	}

	let current_timestamp = std::time::SystemTime::now()
		.duration_since(std::time::UNIX_EPOCH)
		.map_err(|e| EnclaveError::GenericError(format!("Failed to get current timestamp: {e}")))?
		.as_millis() as u64;

	let profile = UserProfile {
		first_name: payload.first_name,
		email: payload.email,
		birthday_month: payload.birthday_month,
		birthday_day: payload.birthday_day,
		birthday_year: payload.birthday_year,
		gender: payload.gender,
		show_gender: payload.show_gender,
		interested_in: payload.interested_in,
		relationship_intent: payload.relationship_intent,
		interests: payload.interests,
	};

	Ok(Json(to_signed_response(
		&state.eph_kp,
		profile,
		current_timestamp,
		IntentScope::ProcessData,
	)))
}

#[cfg(test)]
mod test {
	use super::*;
	use crate::common::IntentMessage;
	use fastcrypto::{ed25519::Ed25519KeyPair, traits::KeyPair};
	use axum::{extract::State, Json};
	use std::sync::Arc;

	#[tokio::test]
	async fn test_process_data_happy_path() {
		let state = Arc::new(AppState {
			eph_kp: Ed25519KeyPair::generate(&mut rand::thread_rng()),
			api_key: "".to_string(),
		});

		let req = ProcessDataRequest {
			payload: ProfileRequest {
				first_name: "Alex".to_string(),
				email: "alex@example.com".to_string(),
				birthday_month: 1,
				birthday_day: 2,
				birthday_year: 1990,
				gender: "non-binary".to_string(),
				show_gender: true,
				interested_in: "friends".to_string(),
				relationship_intent: vec!["long_term".to_string()],
				interests: vec!["hiking".to_string(), "music".to_string()],
			},
		};

		let signed = process_data(State(state.clone()), Json(req)).await.unwrap();
		let response = signed.response.data;
		assert_eq!(response.first_name, "Alex");
		assert_eq!(response.email, "alex@example.com");
		assert_eq!(response.interests.len(), 2);
	}

	#[test]
	fn test_serde_roundtrip() {
		let payload = UserProfile {
			first_name: "Alex".to_string(),
			email: "alex@example.com".to_string(),
			birthday_month: 1,
			birthday_day: 2,
			birthday_year: 1990,
			gender: "non-binary".to_string(),
			show_gender: true,
			interested_in: "friends".to_string(),
			relationship_intent: vec!["long_term".to_string()],
			interests: vec!["hiking".to_string(), "music".to_string()],
		};
		let timestamp = 1744038900000u64;
		let intent_msg = IntentMessage::new(payload.clone(), timestamp, IntentScope::ProcessData);
		let bytes = bcs::to_bytes(&intent_msg).expect("bcs serialization should succeed");
		// Basic sanity checks on serialization
		assert!(!bytes.is_empty());

		// Roundtrip via bcs
		let decoded: IntentMessage<UserProfile> = bcs::from_bytes(&bytes).expect("bcs deserialization");
		assert_eq!(decoded.timestamp_ms, timestamp);
		assert_eq!(decoded.payload.first_name, payload.first_name);
	}
}

