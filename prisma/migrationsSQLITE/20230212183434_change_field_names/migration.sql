/*
  Warnings:

  - You are about to drop the column `created` on the `Work` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Work` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Work" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT'
);
INSERT INTO "new_Work" ("description", "id", "status", "title") SELECT "description", "id", "status", "title" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workId" INTEGER NOT NULL,
    "imageName" TEXT NOT NULL,
    "caption" TEXT,
    CONSTRAINT "Images_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("caption", "id", "imageName", "workId") SELECT "caption", "id", "imageName", "workId" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
CREATE UNIQUE INDEX "Images_imageName_key" ON "Images"("imageName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
