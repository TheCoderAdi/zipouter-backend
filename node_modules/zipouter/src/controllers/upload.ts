import * as fs from "fs";
import AdmZip from "adm-zip";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

interface CompilationResult {
  fileName: string;
  output: string;
}

const extractAndProcessZip = async (
  zipFileName: string
): Promise<CompilationResult[]> => {
  let actualFilePath = "";

  if (!zipFileName) throw new ZipNotFoundError("No zip file found.");

  const unzipFolderPath = path.join(
    process.cwd(),
    zipFileName.replace(".zip", "")
  );

  const extractZip = (zipFileName: string, unzipFolderPath: string): void => {
    const zip = new AdmZip(zipFileName);
    zip.extractAllTo(unzipFolderPath, true);
  };

  const compileAndRunJavaFiles = async (
    actualFilePath: string,
    unzipFolderPath: string
  ): Promise<CompilationResult[]> => {
    const files = fs
      .readdirSync(path.join(unzipFolderPath, actualFilePath))
      .filter(
        (file) =>
          file.endsWith(".java") || file.endsWith(".js") || file.endsWith(".py")
      );
    const compilationResults: CompilationResult[] = [];

    for (const file of files) {
      const filePath = path.join(unzipFolderPath, actualFilePath, file);

      const compilationResult: CompilationResult = {
        fileName: file,
        output: "",
      };
      if (file.endsWith(".js")) {
        const runCommand = `node ${filePath}`;
        try {
          const { stdout: runOutput, stderr: runError } = await execAsync(
            runCommand
          );
          if (runError) {
            throw new CompilationError(`Error: ${runError}`);
          } else {
            compilationResult.output = `Output of ${file}:\n${runOutput}`;
          }
        } catch (error) {
          throw new CompilationError("An error occurred during compilation.");
        }
        compilationResults.push(compilationResult);
      } else if (file.endsWith(".py")) {
        const runCommand = `python ${filePath}`;
        try {
          const { stdout: runOutput, stderr: runError } = await execAsync(
            runCommand
          );
          if (runError) {
            throw new CompilationError(`Error: ${runError}`);
          } else {
            compilationResult.output = `Output of ${file}:\n${runOutput}`;
          }
        } catch (error) {
          throw new CompilationError("An error occurred during compilation.");
        }
        compilationResults.push(compilationResult);
      } else if (file.endsWith(".java")) {
        const className = file.replace(".java", "");

        const compileCommand = `javac ${filePath}`;
        const runCommand = `java -classpath ${path.join(
          unzipFolderPath,
          actualFilePath
        )} ${className}`;

        try {
          const { stdout: compileOutput, stderr: compileError } =
            await execAsync(compileCommand);

          if (compileError) {
            throw new CompilationError(`Error: ${compileError}`);
          }

          if (!compileError) {
            const { stdout: runOutput, stderr: runError } = await execAsync(
              runCommand
            );

            if (runError) {
              throw new CompilationError(`Error: ${runError}`);
            } else {
              compilationResult.output = `Output of ${file}:\n${runOutput}`;
            }
          }
        } catch (error) {
          throw new CompilationError("An error occurred during compilation.");
        }

        compilationResults.push(compilationResult);
      }
    }

    return compilationResults;
  };

  if (!fs.existsSync(unzipFolderPath)) {
    extractZip(zipFileName, unzipFolderPath);
    const contents = fs.readdirSync(unzipFolderPath);
    if (contents.length === 1) {
      actualFilePath = contents[0];
    }
  } else {
    console.log("Folder already exists");
  }

  const compilationResults = await compileAndRunJavaFiles(
    actualFilePath,
    unzipFolderPath
  );

  fs.rm(unzipFolderPath, { recursive: true }, (err) => {
    if (err) console.log(err);
  });

  return compilationResults;
};

export { extractAndProcessZip };
