/*
  Warnings:

  - The `subcategory` column on the `Items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Items" DROP COLUMN "subcategory",
ADD COLUMN     "subcategory" "public"."Subcategory";
