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
    const [profiles] = useState<Profile[]>(mockProfiles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<"matches" | "messages">("matches");

    const handleAction = (action: "like" | "nope" | "superlike" | "next") => {
        if (action !== "next") {
            console.log(`Profile ${profiles[currentIndex]?.name} action:`, action);
        }
        setCurrentIndex((prev) => Math.min(prev + 1, profiles.length));
    };

    const profile = profiles[currentIndex];

    const noMore = currentIndex >= profiles.length;

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
                            className={`relative pb-2 transition-colors ${activeTab === t.key ? "text-white" : "text-neutral-400 hover:text-neutral-200"
                                }`}
                        >
                            {t.label}
                            {activeTab === t.key && (
                                <span className="absolute -bottom-[1px] left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#ff0057] via-[#ff2f5d] to-[#ff8a00]" />
                            )}
                        </button>
                    ))}
                </div>
                {/* Scrollable list / placeholder */}
                <div className="mt-6 flex-1 overflow-y-auto pr-1">
                    {/* Placeholder gradient card */}
                    <div className="rounded-xl h-56 bg-gradient-to-br from-[#4DA2FF] via-[#3A8CE6] to-[#4DA2FF] p-4 flex flex-col justify-end shadow-lg">
                        <h3 className="text-lg font-semibold drop-shadow-md">Start Matching</h3>
                        <p className="text-xs leading-relaxed text-white/85 mt-2">
                            Matches will appear here once you start to like people. You can
                            message them directly from here when you're ready to spark the
                            conversation.
                        </p>
                    </div>
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
                        {/* Profile Card */}
                        <div className="relative w-[360px] h-[640px] rounded-2xl overflow-hidden shadow-xl bg-neutral-900 flex flex-col justify-end">
                            {profile && (
                                <>
                                    <img
                                        src={profile.photoUrl}
                                        alt={profile.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {/* Top subtle bar */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900/20 backdrop-blur-sm" />
                                    {/* Info overlay */}
                                    <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
                                        <div className="flex items-center justify-between mb-1">
                                            <h2 className="text-lg font-bold tracking-tight">{profile.name} <span className="font-medium text-neutral-200">{profile.age}</span></h2>
                                            {profile.active && (
                                                <span className="flex items-center gap-1 text-green-400 text-[10px] font-medium">
                                                    <span className="text-green-400">●</span> Recently Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs flex items-center gap-1"><span role="img" aria-label="intent">💙</span>{profile.relationshipIntent}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Floating circular action icons under card */}
                        {!noMore && (
                            <div className="flex mt-5 gap-4">
                                <button
                                    onClick={() => handleAction("nope")}
                                    aria-label="Nope"
                                    className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-red-600/30 text-red-500 flex items-center justify-center text-2xl font-bold transition-colors"
                                >
                                    ×
                                </button>
                                <button
                                    onClick={() => handleAction("superlike")}
                                    aria-label="Super Like"
                                    className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-blue-600/30 text-sky-400 flex items-center justify-center text-2xl font-bold transition-colors"
                                >
                                    ★
                                </button>
                                <button
                                    onClick={() => handleAction("like")}
                                    aria-label="Like"
                                    className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-green-600/30 text-green-400 flex items-center justify-center text-2xl font-bold transition-colors"
                                >
                                    ♥
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom action bar */}
                <div className="fixed bottom-3 left-0 w-full flex justify-center">
                    <div className="flex items-center gap-3 bg-neutral-900/70 backdrop-blur-sm px-4 py-2 rounded-full text-[11px] font-medium border border-neutral-800">
                        <button className="px-2 py-1 rounded hover:bg-neutral-800 transition-colors" disabled={noMore}>Hide</button>
                        <button onClick={() => !noMore && handleAction("nope")} className="px-2 py-1 rounded hover:bg-red-500/20 text-red-400 transition-colors" disabled={noMore}>Nope</button>
                        <button onClick={() => !noMore && handleAction("like")} className="px-2 py-1 rounded hover:bg-green-500/20 text-green-400 transition-colors" disabled={noMore}>Like</button>
                        <button className="px-2 py-1 rounded hover:bg-neutral-800 transition-colors" disabled={noMore}>Open Profile</button>
                        <button className="px-2 py-1 rounded hover:bg-neutral-800 transition-colors" disabled={noMore}>Close Profile</button>
                        <button onClick={() => !noMore && handleAction("superlike")} className="px-2 py-1 rounded hover:bg-blue-500/20 text-sky-400 transition-colors" disabled={noMore}>Super Like</button>
                        <button onClick={() => handleAction("next")} className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors">Next Photo</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecommendationsPage;
