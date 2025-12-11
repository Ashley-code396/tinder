import { prisma } from "../../prisma/prismaClient";


export const saveProfilesToDB = async (profiles: any[]) => {
  for (const profile of profiles) {
    try {
      const fields = profile.data?.content?.fields;
      if (!fields) {
        console.error("Invalid profile structure:", profile);
        continue;
      }

      const nftObjectId = profile.data.objectId;
      const ownerAddress = profile.data.owner?.AddressOwner ?? null;
      const sender = profile.data.creator ?? null;
      const birthday = new Date(
        `${fields.birthday_year}-${fields.birthday_month}-${fields.birthday_day}`
      );

      console.log("Saving profile:", nftObjectId);

      await prisma.userProfile.upsert({
        where: { nftObjectId },
        update: {
          ownerAddress,
          firstName: fields.first_name,
          email: fields.email,
          birthday,
          gender: fields.gender,
          showGender: fields.show_gender,
          interestedIn: fields.interested_in,
          quiltId: fields.quilt_id ?? null,
          photos: fields.photos ?? null,
          sender,
        },
        create: {
          nftObjectId,
          ownerAddress,
          firstName: fields.first_name,
          email: fields.email,
          birthday,
          gender: fields.gender,
          showGender: fields.show_gender,
          interestedIn: fields.interested_in,
          quiltId: fields.quilt_id ?? null,
          photos: fields.photos ?? null,
          sender,
        },
      });

    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }
};
