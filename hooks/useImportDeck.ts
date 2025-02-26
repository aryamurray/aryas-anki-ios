import React, { useState } from "react";
import { SQLiteDatabase } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import JSZip from "jszip";
import * as FileSystem from "expo-file-system";
import { listDocuments, migrateDeck, unzipToDisk } from "@/lib/anki-disk-operations";

type UnzipResult = {
  success: boolean;
  outputDir?: string;
  extractedFiles?: string[];
  error?: string;
};


const useImportDeck = (db: SQLiteDatabase, fileUri: string) => {
  const [error, setError] = useState<undefined | boolean>();
  const [progress, setProgress] = useState<number>(0); //This should be a number from 0-100 representing the % completion of the import
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>();

  const drizzleDb = drizzle(db, { schema });

  const importDeck = async () => {
    try {
      // Step 1: Read the Anki deck file
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      unzipToDisk(fileUri)

    //   listDocuments()

    // migrateDeck()

      
    } catch (err) {
      setError(true);
      console.error('Error importing deck:', err);
    }
  };

  

  return {
    error,
    progress,
    isSuccess,
  };
};

export default useImportDeck;
