import fs from "fs/promises";

export const deleteUnzippedFiles = async (actualFilePath) => {
  try {
    const files = await fs.readdir(process.cwd());

    for (const file of files) {
      if (file.endsWith(".zip") || file === actualFilePath) {
        await fs.rm(file, { recursive: true });
      }
    }
  } catch (error) {
    console.error(`Error deleting unzipped files: ${error.message}`);
  }
};
