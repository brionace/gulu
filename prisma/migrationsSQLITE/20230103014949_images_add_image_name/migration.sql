/*
  Warnings:

  - The primary key for the `Images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Images` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `imageName` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workId" INTEGER NOT NULL,
    "imageName" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    CONSTRAINT "Images_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("caption", "id", "workId") SELECT "caption", "id", "workId" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
CREATE UNIQUE INDEX "Images_imageName_key" ON "Images"("imageName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
