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
    "image" TEXT,
    "metadata" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending'
);
INSERT INTO "new_Quote" ("createdAt", "id", "image", "metadata", "productId", "shopId", "title", "updatedAt", "variantId") SELECT "createdAt", "id", "image", "metadata", "productId", "shopId", "title", "updatedAt", "variantId" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
