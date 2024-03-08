import fs from "fs/promises";
import { exec } from "child_process";
import AdmZip from "adm-zip";
import { promisify } from "util";
import { deleteUnzippedFiles } from "../utils/delete.js";
import path from "path";

const execAsync = promisify(exec);

export const upload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const zipFilePath = path.join(process.cwd(), req.file.originalname);
    const unzipFolderPath = path.join(
      process.cwd(),
      req.file.originalname.replace(".zip", "")
    );
    const actualFilePath = req.file.originalname.replace(".zip", "");

    await fs.writeFile(zipFilePath, req.file.buffer);

    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(unzipFolderPath, true);

    const Files = await fs.readdir(path.join(unzipFolderPath, actualFilePath));
    const compilationResults = [];

    for (const File of Files) {
      const FilePath = path.join(actualFilePath, actualFilePath, File);
      if (File.endsWith(".js")) {
        execAsync(`node ${FilePath}`).then(({ stdout, stderr }) => {
          if (stderr) {
            compilationResults.push({
              fileName: File,
              output: `Error: ${stderr}`,
            });
          } else {
            compilationResults.push({
              fileName: File,
              output: `Output of ${File}:\n${stdout}`,
            });
          }
        });
      } else if (File.endsWith(".py")) {
        execAsync(`python ${FilePath}`).then(({ stdout, stderr }) => {
          if (stderr) {
            compilationResults.push({
              fileName: File,
              output: `Error: ${stderr}`,
            });
          } else {
            compilationResults.push({
              fileName: File,
              output: `Output of ${File}:\n${stdout}`,
            });
          }
        });
      } else {
        const className = File.replace(".java", "");

        try {
          const { stdout, stderr } = await execAsync(`javac ${FilePath}`);

          const result = {
            fileName: File,
            output: stderr
              ? `Error: ${stderr}`
              : `Successfully compiled ${File}`,
          };

          if (!stderr) {
            const { stdout, stderr } = await execAsync(
              `java -classpath ./${actualFilePath}/${actualFilePath} ${className}`
            );

            result.output += stderr
              ? `\nError running ${className}: ${stderr}`
              : `\nOutput of ${className}:\n${stdout}`;
          }

          compilationResults.push(result);
        } catch (error) {
          console.error(`Error processing ${File}: ${error.message}`);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Files uploaded",
      compilationResults,
    });

    await deleteUnzippedFiles(actualFilePath);
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ error: error.message });
  }
};

export const multiUpload = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No files uploaded" });
    }

    const results = [];

    for (const file of files) {
      const zipFilePath = path.join(process.cwd(), file.originalname);
      const unzipFolderPath = path.join(
        process.cwd(),
        file.originalname.replace(".zip", "")
      );
      const actualFilePath = file.originalname.replace(".zip", "");

      await fs.writeFile(zipFilePath, file.buffer);

      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(unzipFolderPath, true);

      const Files = await fs.readdir(
        path.join(unzipFolderPath, actualFilePath)
      );
      const compilationResults = [];

      for (const File of Files) {
        const FilePath = path.join(actualFilePath, actualFilePath, File);
        if (File.endsWith(".js")) {
          execAsync(`node ${FilePath}`).then(({ stdout, stderr }) => {
            if (stderr) {
              compilationResults.push({
                fileName: File,
                output: `Error: ${stderr}`,
              });
            } else {
              compilationResults.push({
                fileName: File,
                output: `Output of ${File}:\n${stdout}`,
              });
            }
          });
        } else if (File.endsWith(".py")) {
          execAsync(`python ${FilePath}`).then(({ stdout, stderr }) => {
            if (stderr) {
              compilationResults.push({
                fileName: File,
                output: `Error: ${stderr}`,
              });
            } else {
              compilationResults.push({
                fileName: File,
                output: `Output of ${File}:\n${stdout}`,
              });
            }
          });
        } else {
          const className = File.replace(".java", "");

          try {
            const { stdout, stderr } = await execAsync(`javac ${FilePath}`);

            const result = {
              fileName: File,
              output: stderr
                ? `Error: ${stderr}`
                : `Successfully compiled ${File}`,
            };

            if (!stderr) {
              const { stdout, stderr } = await execAsync(
                `java -classpath ./${actualFilePath}/${actualFilePath} ${className}`
              );

              result.output += stderr
                ? `\nError running ${className}: ${stderr}`
                : `\nOutput of ${className}:\n${stdout}`;
            }

            compilationResults.push(result);
          } catch (error) {
            console.error(`Error processing ${File}: ${error.message}`);
          }
        }
      }

      results.push({
        fileName: file.originalname,
        compilationResults,
      });

      await deleteUnzippedFiles(actualFilePath);
    }

    res.status(200).json({
      success: true,
      message: "Files uploaded",
      results,
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ error: error.message });
  }
};
