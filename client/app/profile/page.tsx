"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { ProfileMintParams} from "./types";
import { encryptData, useSealClient } from "../lib/sealClient";
import { uploadQuiltToWalrus } from "../lib/walrus";
import { useNetworkVariable } from "../networkConfig";
import { fromHex, toHex } from "@mysten/sui/utils";
import { toast } from "sonner";
import { BACKEND_URL } from "../constants";

interface FormData {
  firstName: string;
  email: string;
  birthday: {
    month: string;
    day: string;
    year: string;
  };
  gender: "Man" | "Woman" | null;
  showGender: boolean;
  interestedIn: "Men" | "Women" | "Everyone" | null;
  relationshipIntent: string[];
  interests: string[];
  photos: (File | string)[];
}

interface RelationshipOption {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}

interface Interest {
  id: string;
  name: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("packageId");
  const sealClient = useSealClient();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    birthday: { month: "", day: "", year: "" },
    gender: null,
    showGender: false,
    interestedIn: null,
    relationshipIntent: [],
    interests: [],
    photos: [],
  });
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const relationshipOptions: RelationshipOption[] = [
    { id: "long-term", emoji: "💕", title: "Long-term partner", subtitle: "" },
    { id: "long-term-open", emoji: "😘", title: "Long-term,", subtitle: "open to short" },
    { id: "short-term-open", emoji: "🥂", title: "Short-term,", subtitle: "open to long" },
    { id: "short-term-fun", emoji: "🎉", title: "Short-term fun", subtitle: "" },
    { id: "new-friends", emoji: "✋", title: "New friends", subtitle: "" },
    { id: "figuring-out", emoji: "🤔", title: "Still figuring it out", subtitle: "" },
  ];

  const availableInterests: Interest[] = [
    { id: "spa", name: "Spa" },
    { id: "spotify", name: "Spotify" },
    { id: "social-media", name: "Social Media" },
    { id: "exhibition", name: "Exhibition" },
    { id: "fitness", name: "Fitness classes" },
    { id: "travel", name: "Travel" },
    { id: "photography", name: "Photography" },
    { id: "cooking", name: "Cooking" },
    { id: "music", name: "Music" },
    { id: "art", name: "Art" },
  ];

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.gender !== null &&
      formData.interestedIn !== null &&
      formData.photos.length >= 2 &&
      formData.birthday.month !== "" &&
      formData.birthday.day !== "" &&
      formData.birthday.year !== ""
    );
  };

  const encryptAndUploadPhotos = async (
    photos: (File | string)[],
    packageId: string,
    whitelistId: string,
    sealClient: any
  ): Promise<{ quiltId: string; patchIds: Record<string, string> }> => {
    // Only encrypt File objects (skip URLs)
    const encryptedFiles: File[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (typeof photo === "string") continue;

      const arrayBuffer = await photo.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Generate unique ID for encryption
      const nonce = crypto.getRandomValues(new Uint8Array(5));
      const whitelistBytes = fromHex(whitelistId);
      const id = toHex(new Uint8Array([...whitelistBytes, ...nonce]));

      const { encryptedBytes } = await encryptData(sealClient, packageId, id, data);

      // Create encrypted file
      const encryptedFile = new File(
        [new Uint8Array(encryptedBytes)],
        photo.name,
        { type: "application/octet-stream" }
      );
      encryptedFiles.push(encryptedFile);
    }

    if (encryptedFiles.length === 0) {
      throw new Error("No new files to upload");
    }

    // ✅ Upload all encrypted files at once as one quilt
    const { quiltId, patchIds } = await uploadQuiltToWalrus(encryptedFiles);

    if (!quiltId) {
      console.error("Upload response:", { encryptedFiles });
      throw new Error("Upload failed: Quilt ID is undefined.");
    }

    return { quiltId, patchIds };
  };
  const handleUploadAllPhotos = async () => {
  if (!currentAccount) {
    toast.error("Connect your wallet first.");
    return;
  }

  const filesToUpload = formData.photos.filter((p) => typeof p !== "string");
  if (filesToUpload.length === 0) {
    toast.error("No new photos selected to upload.");
    return;
  }

  try {
    setIsLoading(true);

    // 0️⃣ Request backend to create whitelist entry
    const res = await fetch(`${BACKEND_URL}/api/whitelist/create-whitelist-entry`, {
      method: "POST",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to create whitelist entry.");
    }

    const { tx: txBytes, whitelistId } = await res.json();

    // 1️⃣ Sign and execute the whitelist transaction
    await signAndExecute({ transaction: txBytes, account: currentAccount });

    if (!whitelistId) {
      toast.error("Failed to get whitelist ID from backend.");
      return;
    }

    // 2️⃣ Encrypt and upload photos
    const { quiltId, patchIds } = await encryptAndUploadPhotos(
      filesToUpload,
      packageId,
      whitelistId,
      sealClient
    );

    toast.success(`Photos uploaded successfully! Quilt ID: ${quiltId}`);
  } catch (err: any) {
    toast.error(err.message || "Failed to upload photos.");
  } finally {
    setIsLoading(false);
  }
};


  const handlePhotoSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };



  const handleContinue = async () => {

  if (!isFormValid()) {
    toast.error("Please fill in all required fields and upload at least 2 photos.");
    return;
  }

  if (!currentAccount) {
    toast.error("No wallet connected. Please connect your wallet.");
    return;
  }

  try {
    setIsLoading(true);

    const mintParams: ProfileMintParams = {
      firstName: formData.firstName,
      email: formData.email,
      birthday: {
        month: parseInt(formData.birthday.month),
        day: parseInt(formData.birthday.day),
        year: parseInt(formData.birthday.year),
      },
      gender: formData.gender!,
      showGender: formData.showGender,
      interestedIn: formData.interestedIn!,
      relationshipIntent: formData.relationshipIntent,
      interests: formData.interests,
    };
    

    // ✅ Call backend to build transaction
    const response = await fetch(`${BACKEND_URL}/api/profile/build-profile-tx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mintParams),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to build transaction.");
    }

    const data = await response.json();
    const txBytes = data.txBytes;
    console.log("📦 Received txBytes:", txBytes);


    // Execute the transaction
    await signAndExecute(
      { transaction: txBytes, account: currentAccount },
      {
        onSuccess: () => {
          toast.success("Profile minted successfully!");
          router.push("/recommendations");
        },
        onError: (err) => {
          toast.error((err as Error)?.message || "Failed to execute transaction.");
        },
      }
    );
  } catch (err) {
    toast.error((err as Error)?.message || "An unexpected error occurred.");
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleBirthdayChange = (field: keyof FormData["birthday"], value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      birthday: {
        ...prev.birthday,
        [field]: numericValue,
      },
    }));
  };

  const handleRelationshipSelect = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      relationshipIntent: prev.relationshipIntent.includes(optionId)
        ? prev.relationshipIntent.filter((id) => id !== optionId)
        : [...prev.relationshipIntent, optionId],
    }));
  };

  const handleRemoveRelationshipIntent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      relationshipIntent: prev.relationshipIntent.filter((item) => item !== id),
    }));
  };

  const handleInterestSelect = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleRemoveInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== id),
    }));
  };



  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      photos: updatedPhotos,
    }));
  };

  const openPhotoModal = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  useEffect(() => {
    return () => {
      formData.photos.forEach((photo) => {
        if (typeof photo !== "string") {
          URL.revokeObjectURL(URL.createObjectURL(photo));
        }
      });
      if (selectedPhoto) {
        URL.revokeObjectURL(selectedPhoto);
      }
    };
  }, [formData.photos, selectedPhoto]);

  const PhotoSlot = ({ index, hasPhoto }: { index: number; hasPhoto: boolean }) => (
    <div className="relative w-32 h-40 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors overflow-hidden">
      {hasPhoto ? (
        <>
          {typeof formData.photos[index] === "string" ? (
            <img
              src={formData.photos[index] as string}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-full object-cover"
              onClick={() => openPhotoModal(formData.photos[index] as string)}
            />
          ) : (
            <img
              src={URL.createObjectURL(formData.photos[index] as File)}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-full object-cover"
              onClick={() => openPhotoModal(URL.createObjectURL(formData.photos[index] as File))}
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePhoto(index);
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-[#4DA2FF] transition-colors"
          >
            ×
          </button>
        </>
      ) : (
        <label className="w-full h-full flex items-center justify-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handlePhotoSelection(e.target.files)}
            className="hidden"
          />

          <div className="w-8 h-8 bg-[#4DA2FF] rounded-full flex items-center justify-center text-white text-xl font-bold">
            +
          </div>
        </label>
      )}
    </div>
  );

  const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#4DA2FF] rounded-full mr-3"></div>
          <span className="text-2xl font-bold">tinder</span>
        </div>
        <button className="flex items-center text-gray-400 hover:text-white">
          <span className="mr-2">🌐</span>
          Language
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Create account</h1>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#4DA2FF] placeholder-gray-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#4DA2FF]"
                placeholder="Enter your email"
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium mb-2">Birthday</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Month</label>
                  <input
                    type="text"
                    value={formData.birthday.month}
                    onChange={(e) => handleBirthdayChange("month", e.target.value)}
                    placeholder="MM"
                    maxLength={2}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#4DA2FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Day</label>
                  <input
                    type="text"
                    value={formData.birthday.day}
                    onChange={(e) => handleBirthdayChange("day", e.target.value)}
                    placeholder="DD"
                    maxLength={2}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#4DA2FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.birthday.year}
                    onChange={(e) => handleBirthdayChange("year", e.target.value)}
                    placeholder="YYYY"
                    maxLength={4}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#4DA2FF]"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "Man")}
                  className={`flex-1 py-3 px-4 rounded-full border-2 transition-colors ${formData.gender === "Man"
                    ? "border-[#4DA2FF] bg-[#4DA2FF]/10"
                    : "border-gray-600 hover:border-gray-500"
                    }`}
                >
                  Man
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "Woman")}
                  className={`flex-1 py-3 px-4 rounded-full border-2 transition-colors ${formData.gender === "Woman"
                    ? "border-[#4DA2FF] bg-[#4DA2FF]/10"
                    : "border-gray-600 hover:border-gray-500"
                    }`}
                >
                  Woman
                </button>
              </div>
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={formData.showGender}
                  onChange={(e) => handleInputChange("showGender", e.target.checked)}
                  className="mr-2 accent-[#4DA2FF]"
                />
                Show my gender on my profile
              </label>
            </div>

            {/* Interested In */}
            <div>
              <label className="block text-sm font-medium mb-2">Interested in</label>
              <div className="flex gap-4">
                {["Men", "Women", "Everyone"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleInputChange("interestedIn", option)}
                    className={`flex-1 py-3 px-4 rounded-full border-2 transition-colors ${formData.interestedIn === option
                      ? "border-[#4DA2FF] bg-[#4DA2FF]/10"
                      : "border-gray-600 hover:border-gray-500"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-sm font-medium mb-2">Looking for</label>
              {formData.relationshipIntent.length > 0 ? (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowRelationshipModal(true)}
                    className="flex items-center py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                  >
                    <span className="text-sm mr-2">✏️</span>
                    Edit Relationship Intent
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {formData.relationshipIntent.map((id) => {
                      const option = relationshipOptions.find((opt) => opt.id === id);
                      return (
                        <div key={id} className="relative">
                          <span className="flex items-center px-3 py-1 bg-[#4DA2FF]/20 border border-[#4DA2FF] rounded-full text-sm">
                            <span className="mr-1">{option?.emoji}</span>
                            {option?.title}
                            <button
                              type="button"
                              onClick={() => handleRemoveRelationshipIntent(id)}
                              className="ml-2 text-[#4DA2FF] hover:text-[#3A8CE6]"
                            >
                              ×
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRelationshipModal(true)}
                  className="flex items-center py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className="text-xl mr-2">+</span>
                  Add Relationship Intent
                </button>
              )}
            </div>

            {/* Optional Section */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-center mb-6">Optional</h3>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium mb-2">Interests</label>
                {formData.interests.length > 0 ? (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setShowInterestModal(true)}
                      className="flex items-center py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors mb-2"
                    >
                      <span className="text-sm mr-2">✏️</span>
                      Edit Interests
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((id) => {
                        const interest = availableInterests.find((int) => int.id === id);
                        return (
                          <div key={id} className="relative">
                            <span className="px-3 py-1 bg-[#4DA2FF]/20 border border-[#4DA2FF] rounded-full text-sm">
                              {interest?.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveInterest(id)}
                                className="ml-2 text-[#4DA2FF] hover:text-[#3A8CE6]"
                              >
                                ×
                              </button>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowInterestModal(true)}
                    className="flex items-center py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xl mr-2">+</span>
                    Add Interests
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Photos */}
          <div>
            <h3 className="text-lg font-medium mb-4">Profile photos</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 6 }, (_, i) => (
                <PhotoSlot key={i} index={i} hasPhoto={i < formData.photos.length} />
              ))}
            </div>
            <div className="text-center text-gray-400 text-sm mb-4">
              <p>Hold, drag and drop or press Space bar and</p>
              <p>Arrow keys to reorder your photos</p>
            </div>
            <div className="text-center text-gray-400 text-sm mb-4">
              <p>Upload 2 photos to start. Add 4 or more to make</p>
              <p>your profile stand out.</p>
            </div>
            {/* Hidden file input stays for photo slot selection */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handlePhotoSelection(files);
                }
              }}
              className="hidden"
              id="photo-upload"
            />

            {/* Upload button now only uploads already selected photos */}
            <button
              type="button"
              onClick={handleUploadAllPhotos}
              className="block w-full py-3 px-4 bg-[#4DA2FF] text-white rounded-lg text-center hover:bg-[#3A8CE6] transition-colors cursor-pointer"
            >
              Upload Photos
            </button>

          </div>
        </div>

        {/* Continue Button */}
        <div className="flex flex-col items-center mt-12">
          <button
            type="button"
            disabled={!isFormValid() || isLoading}
            onClick={handleContinue}
            className={`w-full max-w-md py-4 text-white rounded-full text-lg font-semibold transition-all ${isFormValid() && !isLoading
              ? "bg-[#4DA2FF] hover:bg-[#3A8CE6]"
              : "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-70"
              }`}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
          <p className="text-center text-blue-400 mt-4 cursor-pointer hover:underline">
            Already have an account? Log in.
          </p>
        </div>
      </div>

      {/* Relationship Intent Modal */}
      <Modal isOpen={showRelationshipModal} onClose={() => setShowRelationshipModal(false)}>
        <h2 className="text-2xl font-bold mb-2">What are you looking for?</h2>
        <p className="text-gray-400 mb-6">All good if it changes. There's something for everyone.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {relationshipOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleRelationshipSelect(option.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-center ${formData.relationshipIntent.includes(option.id)
                ? "border-[#4DA2FF] bg-[#4DA2FF]/10"
                : "border-gray-600 bg-gray-800 hover:border-gray-500"
                }`}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className="text-sm font-medium">{option.title}</div>
              {option.subtitle && <div className="text-xs text-gray-400">{option.subtitle}</div>}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowRelationshipModal(false)}
          className="w-full py-3 bg-[#4DA2FF] text-white rounded-lg hover:bg-[#3A8CE6] transition-colors"
        >
          Save
        </button>
      </Modal>

      {/* Interests Modal */}
      <Modal isOpen={showInterestModal} onClose={() => setShowInterestModal(false)}>
        <h2 className="text-2xl font-bold mb-6">Select Your Interests</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {availableInterests.map((interest) => (
            <button
              key={interest.id}
              type="button"
              onClick={() => handleInterestSelect(interest.id)}
              className={`px-4 py-2 rounded-full border-2 transition-colors ${formData.interests.includes(interest.id)
                ? "border-[#4DA2FF] bg-[#4DA2FF]/10"
                : "border-gray-600 bg-gray-800 hover:border-gray-500"
                }`}
            >
              {interest.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowInterestModal(false)}
          className="w-full py-3 bg-[#4DA2FF] text-white rounded-lg hover:bg-[#3A8CE6] transition-colors"
        >
          Save
        </button>
      </Modal>

      {/* Photo Adjustment Modal */}
      <Modal isOpen={showPhotoModal} onClose={() => setShowPhotoModal(false)}>
        <h2 className="text-2xl font-bold mb-6 text-center">Adjust Photo</h2>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-64 h-80 bg-gray-700 rounded-lg flex items-center justify-center">
              {selectedPhoto && (
                <img
                  src={selectedPhoto ?? ""}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <div className="absolute inset-0 border-2 border-gray-400 rounded-lg pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
          <button
            type="button"
            className="ml-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
          >
            <span className="text-white">↻</span>
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShowPhotoModal(false)}
            className="flex-1 py-3 bg-[#4DA2FF] text-white rounded-full hover:bg-[#3A8CE6] transition-all"
          >
            Choose
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowPhotoModal(false)}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors mt-2"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};


export default ProfilePage;