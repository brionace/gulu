/*
  Warnings:

  - You are about to drop the column `Caption` on the `Images` table. All the data in the column will be lost.
  - Added the required column `caption` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workId" INTEGER NOT NULL,
    "caption" TEXT NOT NULL,
    CONSTRAINT "Images_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("id", "workId") SELECT "id", "workId" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
