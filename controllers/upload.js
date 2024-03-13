import fs from "fs/promises";
import { extractAndProcessZip } from "zipouter";

export const upload = async (req, res) => {
  try {
    const file = req.file;

    if (!file)
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });

    await fs.writeFile(file.originalname, file.buffer);
    extractAndProcessZip(file.originalname).then((results) => {
      res.status(200).json({
        success: true,
        message: "Files uploaded",
        results,
      });
    });

    fs.rm(file.originalname, { force: true });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ error: error.message });
  }
};

export const multiUpload = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0)
      return res
        .status(400)
        .json({ success: false, error: "No files uploaded" });

    for (const file of files)
      await fs.writeFile(file.originalname, file.buffer);

    const results = await Promise.all(
      files.map((file) => extractAndProcessZip(file.originalname))
    );
    res.status(200).json({
      success: true,
      message: "Files uploaded",
      results,
    });
    await Promise.all(
      files.map((file) => fs.rm(file.originalname, { force: true }))
    );
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ error: error.message });
  }
};
