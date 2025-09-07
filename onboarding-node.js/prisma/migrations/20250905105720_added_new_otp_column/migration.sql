-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oneTimePassword" INTEGER NOT NULL DEFAULT 0;
