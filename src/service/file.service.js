require("dotenv").config();
const { s3 } = require("../utils/aws-heper");

const randomString = (number) => {
  return `${Math.random()
    .toString(36)
    .substring(2, number + 2)}`;
};

const FILE_TYPE_MATCH = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "video/mp3",
  "video/mp4",
  "video/x-matroska",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.rar",
  "application/zip",
  "text/plain",
  "application/vnd.ms-powerpoint",
  "application/x-zip-compressed",
];
const uploadFile = async (file) => {
  console.log(file);
  const filePath = `${randomString(4)}-${new Date().getTime()}--${
    file?.originalname
  }`;
  if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
    throw new Error(`${file?.originalname} is in valid!`);
  }

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Body: file?.buffer,
    Key: filePath,
    ContentType: file?.mimetype,
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    console.log(data.Location);
    return data.Location;
  } catch (error) {
    console.error(error);
    throw new Error("Upload file to S3 failed: " + error);
  }
};

module.exports = { uploadFile };
