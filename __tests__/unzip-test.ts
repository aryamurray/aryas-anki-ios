// import { unzipBase64 } from '../lib/unzip'

// describe("unzipBase64 function", () => {
//   it("should correctly extract files from a Base64 zip", async () => {
//     // A sample Base64-encoded zip file (Replace with a real one for accuracy)
//     //Sample 0kb zip file for test
//     const base64Zip = "UEsDBBQAAAAAADuY9lYAAAAAAAAAAAAAAAAWAAAAWklQXzBLQi9GaWxlLTRSWkF1LnppcFBLAwQUAAAAAAA7mPZWAAAAAAAAAAAAAAAAFgAAAFpJUF8wS0IvRmlsZS01bDFuNS56aXBQSwMEFAAAAAAAO5j2VgAAAAAAAAAAAAAAABYAAABaSVBfMEtCL0ZpbGUtOEFIS1cuemlwUEsDBBQAAAAAADuY9lYAAAAAAAAAAAAAAAAWAAAAWklQXzBLQi9GaWxlLThMVldaLnppcFBLAwQUAAAAAAA7mPZWAAAAAAAAAAAAAAAAFgAAAFpJUF8wS0IvRmlsZS1BQzFhMC56aXBQSwMEFAAAAAAAO5j2VgAAAAAAAAAAAAAAABYAAABaSVBfMEtCL0ZpbGUtZHptYnguemlwUEsDBBQAAAAAADqY9lYAAAAAAAAAAAAAAAAWAAAAWklQXzBLQi9GaWxlLUVkWGhkLnppcFBLAwQUAAAAAAA6mPZWAAAAAAAAAAAAAAAAFgAAAFpJUF8wS0IvRmlsZS1OcFZkSC56aXBQSwMEFAAAAAAAOpj2VgAAAAAAAAAAAAAAABYAAABaSVBfMEtCL0ZpbGUtdktGTGcuemlwUEsDBBQAAAAAADqY9lYAAAAAAAAAAAAAAAAWAAAAWklQXzBLQi9GaWxlLVl6NDIyLnppcFBLAQIUABQAAAAAADuY9lYAAAAAAAAAAAAAAAAWAAAAAAAAAAAAIAAAAAAAAABaSVBfMEtCL0ZpbGUtNFJaQXUuemlwUEsBAhQAFAAAAAAAO5j2VgAAAAAAAAAAAAAAABYAAAAAAAAAAAAgAAAANAAAAFpJUF8wS0IvRmlsZS01bDFuNS56aXBQSwECFAAUAAAAAAA7mPZWAAAAAAAAAAAAAAAAFgAAAAAAAAAAACAAAABoAAAAWklQXzBLQi9GaWxlLThBSEtXLnppcFBLAQIUABQAAAAAADuY9lYAAAAAAAAAAAAAAAAWAAAAAAAAAAAAIAAAAJwAAABaSVBfMEtCL0ZpbGUtOExWV1ouemlwUEsBAhQAFAAAAAAAO5j2VgAAAAAAAAAAAAAAABYAAAAAAAAAAAAgAAAA0AAAAFpJUF8wS0IvRmlsZS1BQzFhMC56aXBQSwECFAAUAAAAAAA7mPZWAAAAAAAAAAAAAAAAFgAAAAAAAAAAACAAAAAEAQAAWklQXzBLQi9GaWxlLWR6bWJ4LnppcFBLAQIUABQAAAAAADqY9lYAAAAAAAAAAAAAAAAWAAAAAAAAAAAAIAAAADgBAABaSVBfMEtCL0ZpbGUtRWRYaGQuemlwUEsBAhQAFAAAAAAAOpj2VgAAAAAAAAAAAAAAABYAAAAAAAAAAAAgAAAAbAEAAFpJUF8wS0IvRmlsZS1OcFZkSC56aXBQSwECFAAUAAAAAAA6mPZWAAAAAAAAAAAAAAAAFgAAAAAAAAAAACAAAACgAQAAWklQXzBLQi9GaWxlLXZLRkxnLnppcFBLAQIUABQAAAAAADqY9lYAAAAAAAAAAAAAAAAWAAAAAAAAAAAAIAAAANQBAABaSVBfMEtCL0ZpbGUtWXo0MjIuemlwUEsFBgAAAAAKAAoAqAIAAAgCAAAAAA=="; 

//     // Call function
//     const extractedFiles = await unzipBase64(base64Zip);

//     // Check if the output matches expectations
//     expect(extractedFiles).toBeDefined();
//     expect(Object.keys(extractedFiles).length).toBeGreaterThan(0); // Ensure files were extracted
//   });

//   it("should return an empty object for invalid Base64 data", async () => {
//     const invalidBase64 = "INVALID_BASE64";

//     await expect(unzipBase64(invalidBase64)).rejects.toThrow();
//   });
// });
