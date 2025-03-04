import React from "react";
import { Text, View } from "react-native";
import { Plus, Trash, Trash2 } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {
  getFilenameFromUri,
  mergeDb,
  migrateAssets,
  unzipToDisk,
} from "@/lib/anki-disk-operations";
import "@/global.css";
import { DATABASE_NAME } from "./_layout";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "@/db/schema";
import { count, eq } from "drizzle-orm";

// A separate function for selecting the file
const selectFile = async (): Promise<string | undefined> => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/octet-stream", // Allow all file types
      copyToCacheDirectory: true, // Optional: Copies the file to the app's cache directory
      multiple: false,
    });

    if (!res.canceled) {
      const file = res.assets[0]; // Access the first selected file
      if (!file.name.includes(".apkg")) throw new Error("Invalid File Type");
      return file.uri; // Return the URI if the file is valid
    } else {
      console.log("User canceled the document picker");
    }
  } catch (err) {
    console.error("Error Selecting Document:", err);
  }
};

// A separate function to handle deck merging and file processing
const handleMergeDeck = async (fileUri: string) => {
  try {
    const files = await unzipToDisk(fileUri);

    if (!files) throw new Error("Unzipping error");

    console.log("[Info] Unzipped files are", files);
    await migrateAssets(files);
    await mergeDb(DATABASE_NAME,getFilenameFromUri(fileUri)!);
  } catch (error) {
    console.error("Error during deck merge:", error);
  }
}

// The main component for rendering the UI
export default function Home() {
  const database = useSQLiteContext();
  const db = drizzle(database, { schema });

  //Used to import new Deck
  const handleButtonPress = async () => {
    const fileUri = await selectFile();
    if (fileUri) {
      await handleMergeDeck(fileUri);
    }
  };

  const handleDeleteDocuments = async () => {
    try {
      // Get the list of files in the document directory
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory || ""
      );

      // Iterate through each file and delete it
      for (const file of files) {
        const fileUri = `${FileSystem.documentDirectory}${file}`;
        await FileSystem.deleteAsync(fileUri);
        console.log(`Deleted file: ${file}`);
      }

      console.log("All files in the documents directory have been deleted.");
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const { data: decks, error: queryError } = useLiveQuery(
    db
      .select({
        name: schema.decks.name,
        deck_id: schema.decks.id,
        card_count: count(schema.cards.id).as("card_count"),
      })
      .from(schema.decks)
      .leftJoin(schema.cards, eq(schema.decks.id, schema.cards.did))
      .groupBy(schema.decks.name)
  );

  return (
    <View className="bg-slate-500 w-full h-full">
      <View className="flex-row justify-between items-end p-4">
        <Trash2 size={36} onPress={handleDeleteDocuments} color={"black"} />
        <Plus size={36} onPress={handleButtonPress} color={"black"} />
      </View>
      <View>
        {decks.map((deck) => (
          <View key={deck.name} className="flex flex-col">
            <Text>{deck.name}</Text>
            <Text>{deck.card_count}</Text>
          </View>
        ))}
        {queryError && <Text>{queryError.message}</Text>}
      </View>
    </View>
  );
}
