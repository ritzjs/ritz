# Migration `20200514183443`

This migration has been generated by Republic Productions at 5/14/2020, 6:34:43 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "quaint"."Project" (
    "id" INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL  
) 

PRAGMA "quaint".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200514183443
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,27 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource sqlite {
+  provider = "sqlite"
+  url      = "file:./db.sqlite"
+}
+
+// SQLite is easy to start with, but if you use Postgres in production
+// you should also use it in development with the following:
+//datasource postgresql {
+//  provider = "postgresql"
+//  url      = env("DATABASE_URL")
+//}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+
+// --------------------------------------
+
+model Project {
+  id        Int      @default(autoincrement()) @id
+  name      String
+}
+
```


