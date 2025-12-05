module suitinder::profileNft;

use std::string::String;
use sui::event;

public struct ProfileNFT has key, store {
    id: UID,
    first_name: String,
    email: String,
    birthday_month: u64,
    birthday_day: u64,
    birthday_year: u64,
    gender: String,
    show_gender: bool,
    interested_in: String,
    relationship_intent: vector<String>,
    interests: vector<String>,
    //photos: vector<Url>,
}
public struct OwnerCap has key {
    id: UID,
    profile_nft_id: ID,
}

public struct ProfileNFTMinted has copy, drop {
    profile_nft_id: ID,
    creator: address,
    first_name: String,
}

#[allow(lint(self_transfer))]
public fun mint_profile_nft(
    first_name: String,
    email: String,
    birthday_month: u64,
    birthday_day: u64,
    birthday_year: u64,
    gender: String,
    show_gender: bool,
    interested_in: String,
    relationship_intent: vector<String>,
    interests: vector<String>,
    //photos: vector<Url>,
    ctx: &mut TxContext,
) {
    let profile_nft = ProfileNFT {
        id: object::new(ctx),
        first_name,
        email,
        birthday_month,
        birthday_day,
        birthday_year,
        gender,
        show_gender,
        interested_in,
        relationship_intent,
        interests,
        //photos
    };
    let owner_cap = OwnerCap {
        id: object::new(ctx),
        profile_nft_id: object::id(&profile_nft),
    };
    event::emit(ProfileNFTMinted {
        profile_nft_id: object::id(&profile_nft),
        creator: ctx.sender(),
        first_name: profile_nft.first_name,
    });

    transfer::public_transfer(profile_nft, ctx.sender());
    transfer::transfer(owner_cap, ctx.sender())
}

public fun burn_profile_nft(cap: OwnerCap, profile_nft: ProfileNFT) {
    let OwnerCap { id, profile_nft_id: _ } = cap;
    id.delete();

    let ProfileNFT {
        id,
        first_name: _,
        email: _,
        birthday_month: _,
        birthday_day: _,
        birthday_year: _,
        gender: _,
        show_gender: _,
        interested_in: _,
        relationship_intent: _,
        interests: _,
    } = profile_nft;
    id.delete();
}
