-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "nftObjectId" TEXT NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "showGender" BOOLEAN NOT NULL,
    "interestedIn" TEXT NOT NULL,
    "quiltId" TEXT,
    "photos" JSONB,
    "sender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipIntent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "RelationshipIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCursor" (
    "id" TEXT NOT NULL,
    "txDigest" TEXT NOT NULL,
    "eventSeq" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCursor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RelationshipIntentToUserProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelationshipIntentToUserProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InterestToUserProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterestToUserProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_nftObjectId_key" ON "UserProfile"("nftObjectId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipIntent_key_key" ON "RelationshipIntent"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_key_key" ON "Interest"("key");

-- CreateIndex
CREATE INDEX "_RelationshipIntentToUserProfile_B_index" ON "_RelationshipIntentToUserProfile"("B");

-- CreateIndex
CREATE INDEX "_InterestToUserProfile_B_index" ON "_InterestToUserProfile"("B");

-- AddForeignKey
ALTER TABLE "_RelationshipIntentToUserProfile" ADD CONSTRAINT "_RelationshipIntentToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "RelationshipIntent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelationshipIntentToUserProfile" ADD CONSTRAINT "_RelationshipIntentToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestToUserProfile" ADD CONSTRAINT "_InterestToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestToUserProfile" ADD CONSTRAINT "_InterestToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
