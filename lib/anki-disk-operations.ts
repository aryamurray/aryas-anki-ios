import JSZip from "jszip";
import * as Filesystem from "expo-file-system";
import { openDatabaseAsync, openDatabaseSync } from "expo-sqlite";
import { DATABASE_NAME } from "@/app/_layout";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import pLimit from "p-limit";
import { InferSelectModel, sql } from "drizzle-orm";

//This should return a list of the new files created in the cache directory.
//Then they can be migrated over into the document directory for asset storage.

/**
 *
 * @param fileUri Link to an .apkg file on the local Filesystem
 *
 *
 * @returns An array of strings representing all filenames/directories that existed within the apkg package
 */
export async function unzipToDisk(
  fileUri: string
): Promise<string[] | undefined> {
  try {
    // Read the file as a binary blob
    const fileContent = await Filesystem.readAsStringAsync(fileUri, {
      encoding: Filesystem.EncodingType.Base64,
    });

    const zip = await JSZip.loadAsync(fileContent, { base64: true });

    let fileNames: string[] = [];

    await Promise.all(
      Object.values(zip.files).map(async (file) => {
        file.dir
          ? console.log(`[Info] Writing Directory '${file.name}' to disk`)
          : console.log(`[Info] Writing file '${file.name}' to disk`);

        const content = await file.async("base64"); // Await this properly
        await Filesystem.writeAsStringAsync(
          Filesystem.cacheDirectory + file.name,
          content,
          { encoding: Filesystem.EncodingType.Base64 }
        );
        fileNames.push(file.name);
      })
    );
    console.log("[Info] All files written to disk successfully");
    return fileNames;
  } catch (error) {
    console.error(error);
  }
}

export async function migrateAssets(fileNames: string[]): Promise<void> {
  console.log("[Info] Starting File Migration from cache to documents");
  const cleasedFiles = fileNames.filter((name) => !name.includes("collection"));

  // Limit the number of concurrent promises
  const limit = pLimit(5); // limit concurrency to 5

  const migrationPromises = cleasedFiles.map((fileName) => {
    return limit(async () => {
      const from = Filesystem.cacheDirectory + fileName;
      const dest = Filesystem.documentDirectory + fileName;

      try {
        const { exists } = await Filesystem.getInfoAsync(from);
        if (exists) {
          await Filesystem.moveAsync({ from, to: dest });
          console.log(`[Info] Moved '${fileName}' to document directory`);
        } else {
          console.error(`[Error] '${fileName}' does not exist at '${from}'`);
        }
      } catch (error) {
        console.error(`[Error] Failed to move '${fileName}':`, error);
      }
    });
  });

  await Promise.all(migrationPromises); // Executes the limited concurrent operations
  console.log("[Info] Successfully Migrated all files");
}

export async function mergeDb(dbName: string,deckName:string): Promise<void> {
  console.log(
    "[Info] Starting to merge Sql Database from:",
    dbName,
    "in cache directory"
  );
  try {
    // Check if the file or directory exists at the source
    const { exists } = await Filesystem.getInfoAsync(
      Filesystem.cacheDirectory + dbName
    );

    !exists &&
      console.error(
        "[Error] Db does not exist. Cannot be merged to master database."
      );
    if (!exists) return;

    const newDeck = await openDatabaseAsync(
      dbName,
      undefined,
      Filesystem.cacheDirectory!
    );
    const masterDb = await openDatabaseAsync(
      DATABASE_NAME,
      undefined,
      Filesystem.documentDirectory!
    );
    const db = drizzle(masterDb, { schema });
    const sourceDb = drizzle(newDeck, { schema }); // This schema is NOT PERFECT. It's a superset of what is actually available in this db

    //We need to pull the relevent tables to copy over, probably not all,
    //Take the cards,col,notes +  the media information.

    const { cards, col, notes } = await sourceDb.transaction(async (tx) => {
      const cards = await tx.select().from(schema.cards);
      const col = await tx.select().from(schema.col);
      const notes = await tx.select().from(schema.notes);

      return { cards, col, notes };
    });

    console.log(
      "[Info] Successfully Queried all needed information from source deck."
    );

    // console.log(cards)

    //Copy over all of the information
    //TODO: Check for ID collisions

    const BATCH_SIZE = 100; // Adjust based on your needs

    await db.transaction(async (tx) => {
      // Insert cards in batches
      for (let i = 0; i < cards.length; i += BATCH_SIZE) {
        const batch = cards.slice(i, i + BATCH_SIZE);
        await tx.insert(schema.cards).values(batch);
      }

      // Insert col in batches
      for (let i = 0; i < col.length; i += BATCH_SIZE) {
        const batch = col.slice(i, i + BATCH_SIZE);
        await tx.insert(schema.col).values(batch);
      }

      // Insert notes in batches
      for (let i = 0; i < notes.length; i += BATCH_SIZE) {
        const batch = notes.slice(i, i + BATCH_SIZE);
        await tx.insert(schema.notes).values(batch);
      }

      const deck:InferSelectModel<typeof schema.decks> = {
        id:cards[0].did,
        name:deckName,
        common: new Uint8Array(),
        kind: new Uint8Array(),
        usn:0,
        mtimeSecs:Math.floor(Date.now() / 1000)
      }

      await tx.insert(schema.decks).values(deck)
    });
  } catch (error) {
    console.error(error);
    console.error("[Error] Failed to Copy Deck into Master DB");
  }
}

export function getFilenameFromUri(uri: string): string | null {
  const parts = uri.split("/");
  return parts.length > 0 ? parts[parts.length - 1] : null;
}


export async function listDocuments() {
  try {
    const files = await Filesystem.readDirectoryAsync(
      Filesystem.documentDirectory || ""
    );
    console.log("Files in directory:", files);
    files.forEach(async (file) => {
      const content = await Filesystem.readAsStringAsync(
        Filesystem.documentDirectory + file
      );
      console.log(`${file}:`, content);
    });
  } catch (error) {
    console.error("Error listing files:", error);
  }
}
