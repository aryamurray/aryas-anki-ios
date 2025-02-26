import JSZip from "jszip";
import * as FileSystem from "expo-file-system";

// export async function unzipBase64(
//   base64: string
// ): Promise<Array<[string, string]>> {

//   console.log(zip.files);

//   // Extract files
//   const extractedFiles: Array<[string, string]> = [];

//   for (const fileName of Object.keys(zip.files)) {
//     const file = zip.files[fileName];
//     if (!file.dir) {
//       const fileContent = await file.async("text"); // Get file content as text
//       extractedFiles.push([fileName, fileContent]); // Add tuple to the array
//     }
//   }

//   return extractedFiles;
// }

//This should return a list of the new files created in the cache directory.
//Then they can be migrated over into the document directory for asset storage.
export async function unzipToDisk(fileUri: string): Promise<string[]|undefined> {
  try {
    // Read the file as a binary blob
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const zip = await JSZip.loadAsync(fileContent, { base64: true });

    let fileNames:string[] = []

    await Promise.all(
      Object.values(zip.files).map(async (file) => {
        file.dir
          ? console.log(`[Info] Writing Directory '${file.name}' to disk`)
          : console.log(`[Info] Writing file '${file.name}' to disk`);

        const content = await file.async("base64"); // Await this properly
        await FileSystem.writeAsStringAsync(
          FileSystem.cacheDirectory + file.name,
          content,
          { encoding: FileSystem.EncodingType.Base64 }
        );
        fileNames.push(file.name)
      })
    );

    return fileNames
    console.log("[Info] All files written to disk successfully");
  } catch (error) {
    console.error(error);
  }
}

export async function migrateDeck(fileNames: string[]): Promise<void> {
  for (const fileName of fileNames) {
    const from = FileSystem.cacheDirectory + fileName;
    const dest = FileSystem.documentDirectory + fileName;

    try {
      // Check if the file or directory exists at the source
      const { exists } = await FileSystem.getInfoAsync(from);

      if (exists) {
        await FileSystem.moveAsync({ from, to: dest });
        console.log(`[Info] Moved '${fileName}' to document directory`);
      } else {
        console.error(`[Error] '${fileName}' does not exist at '${from}'`);
      }
    } catch (error) {
      console.error(`[Error] Failed to move '${fileName}':`, error);
    }
  }
}

export async function listDocuments() {
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory || ""
    );
    console.log("Files in directory:", files);
    files.forEach(async (file) => {
      const content = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + file
      );
      console.log(`${file}:`, content);
    });
  } catch (error) {
    console.error("Error listing files:", error);
  }
}
