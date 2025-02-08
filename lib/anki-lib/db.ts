import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';


//Make sure to add WAL for sql operations

export class Deck {
    path: string;
  
    /**
     * Creates a new Deck object for the specified file path.
     *
     * @param {string} path - The path to the directory representing the deck.
     */
    constructor(path: string) {
      this.path = path;
    }

    /**
   * Unpacks an .apkg file and adds the information to the master deck in the Expo app.
   * @param {string} path Either a local or web path to a packaged Anki deck in .apkg form.
   */
  static async unpack(path: string) {
    try {
      // Step 1: Define the destination directory for unpacking the .apkg
      const destinationDir = FileSystem.documentDirectory + 'decks';
      
      // Step 2: Create the decks directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(destinationDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(destinationDir, { intermediates: true });
      }
      
      // Step 3: Handle the .apkg path (local or web)
      let sourceFileUri = path;
      if (sourceFileUri.startsWith('file://')) {
        // Local file
        sourceFileUri = path.replace('file://', '');
      } else {
        // Download and cache file from the web
        const fileInfo = await DocumentPicker.getDocumentAsync({
          type: 'application/zip',
        });
        sourceFileUri = fileInfo.uri;
      }

      // Step 4: Unzip the .apkg file
      const unzippedDir = `${destinationDir}/unzipped_apkg`;
      await Zip.unzip(sourceFileUri, unzippedDir);
      
      // Step 5: Extract the SQLite database and media folder from the unzipped file
      const collectionPath = `${unzippedDir}/collection.anki2`;
      const mediaPath = `${unzippedDir}/media`;

      // Copy the collection.anki2 database into the desired directory (e.g., SQLite database directory)
      const collectionDbDest = `${destinationDir}/collection.anki2`;
      await FileSystem.copyAsync({ from: collectionPath, to: collectionDbDest });

      // Copy the media folder to the appropriate media directory
      const mediaDest = `${destinationDir}/media`;
      await FileSystem.copyAsync({ from: mediaPath, to: mediaDest });

      // Step 6: Add the deck data to the master deck (you can use a class or a method to handle this logic)
      const decks = await Deck.list(); // Assuming this function returns all existing decks
      const deck = new Deck(collectionDbDest); // Assuming you initialize the deck with the new collection database
      await deck.addDeckData();

      console.log("Deck unpacked successfully and added to master collection.");

    } catch (error) {
      console.error('Error unpacking deck:', error);
    }
  }
  
    /**
     * Lists all of the available downloaded decks.
     *
     * @returns {Promise<Deck[]>} A promise that resolves to an array of Deck objects,
     *                            each representing a subdirectory (Anki deck).
     */
    static async list(): Promise<Deck[]> {
      try {
        // Define the path for the 'decks' directory
        const decksPath = `${FileSystem.documentDirectory}decks`;
  
        // Check if the directory exists, create if not
        const dirInfo = await FileSystem.getInfoAsync(decksPath);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(decksPath, { intermediates: true });
          console.log("Directory created at:", decksPath);
        }
  
        // Read the contents of the 'decks' directory
        const filesAndDirs = await FileSystem.readDirectoryAsync(decksPath);
  
        // Filter and return Deck objects for each subdirectory
        const decks: Deck[] = [];
        for (const item of filesAndDirs) {
          const itemPath = `${decksPath}/${item}`;
          const itemInfo = await FileSystem.getInfoAsync(itemPath);
          if (itemInfo.isDirectory) {
            decks.push(new Deck(itemPath));
          }
        }
  
        console.log("Available decks:", decks.map(deck => deck.path));
        return decks;
      } catch (error) {
        console.error("Error listing directories:", error);
        return [];
      }
    }
  
    /**
     * Example method for the Deck instance.
     * Retrieves the name of the deck (last part of the path).
     *
     * @returns {string} The name of the deck.
     */
    getName(): string {
      return this.path.split("/").filter(Boolean).pop() || "Unknown Deck";
    }
  
    /**
     * Deletes the deck directory.
     *
     * @returns {Promise<void>} A promise that resolves when the directory is deleted.
     */
    async delete(): Promise<void> {
      try {
        await FileSystem.deleteAsync(this.path, { idempotent: true });
        console.log(`Deck deleted: ${this.getName()}`);
      } catch (error) {
        console.error(`Error deleting deck '${this.getName()}':`, error);
      }
    }
  }

