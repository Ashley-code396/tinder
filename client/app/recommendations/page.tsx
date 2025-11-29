"use client";

import { useState } from "react";

interface Profile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  relationshipIntent: string;
  active: boolean;
}

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Sam",
    age: 31,
    photoUrl: "https://i.ibb.co/9m1B7v8H/walruscan1.jpg", // replace with actual images
    relationshipIntent: "Long-term partner",
    active: true,
  },
  {
    id: "2",
    name: "Alex",
    age: 28,
    photoUrl: "https://i.ibb.co/hJMH56Ys/ghnanft.png",
    relationshipIntent: "Short-term fun",
    active: false,
  },
  // Add more mock profiles
];

const RecommendationsPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAction = (action: "like" | "nope" | "superlike") => {
    console.log(`Profile ${profiles[currentIndex].name} action:`, action);
    setCurrentIndex((prev) => Math.min(prev + 1, profiles.length - 1));
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">No more recommendations</h2>
        <p className="text-gray-300 text-center max-w-xs">
          Check back later for new matches based on your profile.
        </p>
      </div>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4">
      {/* Profile Card */}
      <div className="relative w-80 h-[500px] bg-blue-700 rounded-xl overflow-hidden shadow-lg flex flex-col justify-end">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="bg-black bg-opacity-50 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{profile.name}, {profile.age}</h2>
            {profile.active && <span className="text-green-400 text-sm">● Recently Active</span>}
          </div>
          <p className="text-sm">💙 {profile.relationshipIntent}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex mt-6 gap-4">
        <button
          onClick={() => handleAction("nope")}
          className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl hover:bg-red-600 transition-colors"
        >
          ×
        </button>
        <button
          onClick={() => handleAction("superlike")}
          className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl hover:bg-blue-600 transition-colors"
        >
          ★
        </button>
        <button
          onClick={() => handleAction("like")}
          className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl hover:bg-green-600 transition-colors"
        >
          ♥
        </button>
      </div>
    </div>
  );
};

export default RecommendationsPage;
