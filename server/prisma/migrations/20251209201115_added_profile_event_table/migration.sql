-- CreateTable
CREATE TABLE "ProfileEvent" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileEvent_digest_key" ON "ProfileEvent"("digest");

-- AddForeignKey
ALTER TABLE "ProfileEvent" ADD CONSTRAINT "ProfileEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
