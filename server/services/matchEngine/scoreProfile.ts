import { UserProfile, Interest, RelationshipIntent } from "../../generated/prisma/client";

export const scoreProfile = (
  user: UserProfile & { interests: Interest[]; relationshipIntents: RelationshipIntent[] },
  candidate: UserProfile & { interests: Interest[]; relationshipIntents: RelationshipIntent[] }
): number => {
  let score = 0;

  // Age difference
  const userAge = new Date().getFullYear() - user.birthday.getFullYear();
  const candidateAge = new Date().getFullYear() - candidate.birthday.getFullYear();
  const ageDiff = Math.abs(userAge - candidateAge);
  score += Math.max(0, 10 - ageDiff);

  // Gender preference
  if (user.interestedIn === candidate.gender) score += 10;

  // Shared interests
  const sharedInterests = candidate.interests.filter(i => user.interests.includes(i));
  score += sharedInterests.length * 5;

  // Relationship intent
  const sharedIntents = candidate.relationshipIntents.filter(i => user.relationshipIntents.includes(i));
  score += sharedIntents.length * 5;

//   // Optional: random factor
  score += Math.random() * 2;

  return score;
};
