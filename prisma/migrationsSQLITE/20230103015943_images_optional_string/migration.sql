-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workId" INTEGER NOT NULL,
    "imageName" TEXT NOT NULL,
    "caption" TEXT,
    CONSTRAINT "Images_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("caption", "id", "imageName", "workId") SELECT "caption", "id", "imageName", "workId" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
CREATE UNIQUE INDEX "Images_imageName_key" ON "Images"("imageName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
