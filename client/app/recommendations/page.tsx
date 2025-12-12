"use client";

import { useState, useEffect } from "react";
import { BACKEND_URL } from "../constants";
import { useUser } from "../context/userContext";

interface Profile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  relationshipIntent: string;
  active: boolean;
}

const RecommendationsPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"matches" | "messages">("matches");
  const [loading, setLoading] = useState(true);

  const { userId } = useUser(); // get userId from context

  useEffect(() => {
    if (!userId) return; // wait until userId is available

    const fetchMatches = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/matches/${userId}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          setProfiles([]);
          return;
        }

        const transformed: Profile[] = data.map((p: any) => ({
          id: p.id,
          name: p.firstName,
          age: new Date().getFullYear() - new Date(p.birthday).getFullYear(),
          photoUrl: p.photos?.[0] || "https://via.placeholder.com/400x600",
          relationshipIntent: p.relationshipIntents?.map((ri: any) => ri.key).join(", ") || "Unknown",
          active: true,
        }));

        setProfiles(transformed);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]); // re-run when userId becomes available

  const handleAction = (action: "like" | "nope" | "superlike" | "next") => {
    if (action !== "next") {
      console.log(`Profile ${profiles[currentIndex]?.name} action:`, action);
    }
    setCurrentIndex((prev) => Math.min(prev + 1, profiles.length));
  };

  const profile = profiles[currentIndex];
  const noMore = currentIndex >= profiles.length;

  if (loading) return <div className="text-white">Loading matches...</div>;

  return (
    <div className="min-h-screen w-full bg-[#0f0f11] text-white flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[320px] border-r border-neutral-800 flex flex-col p-4">
        {/* Tabs */}
        <div className="flex gap-6 text-sm font-medium">
          {[
            { key: "matches", label: "Matches" },
            { key: "messages", label: "Messages" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as "matches" | "messages")}
              className={`relative pb-2 transition-colors ${
                activeTab === t.key ? "text-white" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {t.label}
              {activeTab === t.key && (
                <span className="absolute -bottom-[1px] left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#ff0057] via-[#ff2f5d] to-[#ff8a00]" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          {profiles.length === 0 && (
            <div className="rounded-xl h-56 bg-gradient-to-br from-[#4DA2FF] via-[#3A8CE6] to-[#4DA2FF] p-4 flex flex-col justify-end shadow-lg">
              <h3 className="text-lg font-semibold drop-shadow-md">Start Matching</h3>
              <p className="text-xs leading-relaxed text-white/85 mt-2">
                Matches will appear here once you start to like people.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 bg-black">
        {noMore ? (
          <div className="text-center max-w-sm">
            <h2 className="text-2xl font-semibold mb-2">No more recommendations</h2>
            <p className="text-neutral-400 text-sm">
              Check back later for new matches based on your profile.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-[360px] h-[640px] rounded-2xl overflow-hidden shadow-xl bg-neutral-900 flex flex-col justify-end">
              {profile && (
                <>
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900/20 backdrop-blur-sm" />
                  <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-bold tracking-tight">
                        {profile.name} <span className="font-medium text-neutral-200">{profile.age}</span>
                      </h2>
                      {profile.active && (
                        <span className="flex items-center gap-1 text-green-400 text-[10px] font-medium">
                          <span className="text-green-400">●</span> Recently Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs flex items-center gap-1">
                      <span role="img" aria-label="intent">💙</span>
                      {profile.relationshipIntent}
                    </p>
                  </div>
                </>
              )}
            </div>

            {!noMore && (
              <div className="flex mt-5 gap-4">
                <button onClick={() => handleAction("nope")} aria-label="Nope" className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-red-600/30 text-red-500 flex items-center justify-center text-2xl font-bold transition-colors">×</button>
                <button onClick={() => handleAction("superlike")} aria-label="Super Like" className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-blue-600/30 text-sky-400 flex items-center justify-center text-2xl font-bold transition-colors">★</button>
                <button onClick={() => handleAction("like")} aria-label="Like" className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-green-600/30 text-green-400 flex items-center justify-center text-2xl font-bold transition-colors">♥</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecommendationsPage;
