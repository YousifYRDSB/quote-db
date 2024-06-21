/*
  Warnings:

  - You are about to drop the column `status` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `email` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shopId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "metadata" TEXT,
    "message" TEXT
);
INSERT INTO "new_Quote" ("createdAt", "id", "image", "message", "metadata", "productId", "shopId", "title", "updatedAt", "variantId") SELECT "createdAt", "id", "image", "message", "metadata", "productId", "shopId", "title", "updatedAt", "variantId" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
