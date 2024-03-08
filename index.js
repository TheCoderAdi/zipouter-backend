import express from "express";
import { multipleUpload, singleUpload } from "./multer.js";
import cors from "cors";
import { upload, multiUpload } from "./controllers/upload.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.post("/upload", singleUpload, upload);
app.post("/upload-multiple", multipleUpload, multiUpload);
