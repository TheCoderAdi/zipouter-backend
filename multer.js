import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage: storage }).single("file");
export const multipleUpload = multer({ storage: storage }).array("files", 10);
