-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Work" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT'
);
INSERT INTO "new_Work" ("created", "description", "id", "status", "title", "updated") SELECT "created", "description", "id", "status", "title", "updated" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
