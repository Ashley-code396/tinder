import { prisma } from "../../prisma/prismaClient";


export const saveProfilesToDB = async (profiles: any[]) => {
  for (const profile of profiles) {
    try {
      // Extract fields returned by Sui fullnode
      const fields = profile.data?.content?.fields;
      if (!fields) {
        console.error("Invalid profile structure:", profile);
        continue;
      }

      const nftObjectId = profile.data.objectId;

      console.log("Saving profile:", nftObjectId);

      // Upsert to avoid duplicates
      await prisma.userProfile.upsert({
        where: { nftObjectId }, // unique constraint
        update: {
          ownerAddress: fields.owner,
          firstName: fields.first_name,
          email: fields.email,
          birthday: new Date(Number(fields.birthday)),
          gender: fields.gender,
          showGender: fields.show_gender,
          interestedIn: fields.interested_in,
          quiltId: fields.quilt_id ?? null,
          photos: fields.photos ?? null,
          sender: fields.creator,
        },
        create: {
          nftObjectId,
          ownerAddress: fields.owner,
          firstName: fields.first_name,
          email: fields.email,
          birthday: new Date(Number(fields.birthday)),
          gender: fields.gender,
          showGender: fields.show_gender,
          interestedIn: fields.interested_in,
          quiltId: fields.quilt_id ?? null,
          photos: fields.photos ?? null,
          sender: fields.creator,
        },
      });

    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }
};
