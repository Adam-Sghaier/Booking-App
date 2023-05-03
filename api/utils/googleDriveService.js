import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
export const authenticateGoogle = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/../../../secure/upload-images-service.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

export const uploadToGoogleDrive = async (file, auth) => {
  const fileMetadata = {
    name: file.originalname,
    parents: ["1HJVDiPFtZxmou5hWNofIesl-KL7Df4Zp"], // Change it according to your desired parent folder id
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });
  return response;
};

export const deleteFile = (filePath) => {
  fs.unlink(filePath, () => {
    console.log("file deleted");
  });
};

export const deleteUploaded = async (auth, fileId) => {
  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.delete({ fileId: fileId });
  return response;
};
