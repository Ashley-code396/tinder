import { prisma } from "../../prisma/prismaClient";
import { scoreProfile } from "./scoreProfile";
import { UserProfile } from "../../generated/prisma/client";

export const getMatches = async (currentUserId: string, limit = 20): Promise<UserProfile[]> => {
  const currentUser = await prisma.userProfile.findUnique({ 
    where: { id: currentUserId },
    include: {
      interests: true,
      relationshipIntents: true,
    }
  });

  if (!currentUser) throw new Error("User not found");

  const candidates = await prisma.userProfile.findMany({
    where: { id: { not: currentUserId } },
    include: {
      interests: true,
      relationshipIntents: true,
    }
  });

  const scoredCandidates = candidates
    .map(c => ({ profile: c, score: scoreProfile(currentUser, c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(c => c.profile);

  return scoredCandidates;
};
