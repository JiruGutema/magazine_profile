-- CreateTable
CREATE TABLE IF NOT EXISTS "BlogPostReaction" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "userKey" TEXT NOT NULL,
    "deviceKey" TEXT NOT NULL,
    "fingerprint" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "reaction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "BlogPostReaction_postId_userId_key" ON "BlogPostReaction"("postId", "userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlogPostReaction_postId_deviceKey_idx" ON "BlogPostReaction"("postId", "deviceKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlogPostReaction_postId_ipAddress_idx" ON "BlogPostReaction"("postId", "ipAddress");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlogPostReaction_ipAddress_createdAt_idx" ON "BlogPostReaction"("ipAddress", "createdAt");

-- AddForeignKey
ALTER TABLE "BlogPostReaction" DROP CONSTRAINT IF EXISTS "BlogPostReaction_postId_fkey";
ALTER TABLE "BlogPostReaction" ADD CONSTRAINT "BlogPostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
