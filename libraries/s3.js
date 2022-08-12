import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESSKEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESSKEY,
  },
});

/**
 * Convert AWS S3 stream to string
 *
 * @param {Stream} stream
 *
 * @returns {String}
 */
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    if (stream instanceof ReadableStream === false) {
      reject(
        "Expected stream to be instance of ReadableStream, but got " +
          typeof stream
      );
    }
    let text = "";
    const decoder = new TextDecoder("utf-8");

    const reader = stream.getReader();
    const processRead = ({ done, value }) => {
      if (done) {
        // resolve promise with chunks
        // resolve(Buffer.concat(chunks).toString("utf8"));
        resolve(text);
        return;
      }

      text += decoder.decode(value);

      // Not done, keep reading
      reader.read().then(processRead);
    };

    // start read
    reader.read().then(processRead);
  });
};

/**
 * Upload file to S3 bucket
 *
 * @param {String} filename
 * @param {Blob} data
 * @param {Function} onProgress
 *
 * @returns {Boolean}
 */
export const uploadFile = async (filename, data, onProgress = null) => {
  const target = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
    ACL: "public-read",
    Key: `${
      process.env.NEXT_PUBLIC_S3_DIRNAME &&
      process.env.NEXT_PUBLIC_S3_DIRNAME !== ""
        ? process.env.NEXT_PUBLIC_S3_DIRNAME + "/"
        : ""
    }${filename}`,
    Body: data,
  };

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      queueSize: 4, // optional concurrency configuration
      leavePartsOnError: false, // optional manually handle dropped parts
      params: target,
    });

    parallelUploads3.on("httpUploadProgress", (pInfo) => {
      const progress = Math.floor((pInfo.loaded / pInfo.total) * 100);
      if (onProgress) {
        onProgress(progress);
      }
    });

    await parallelUploads3.done();
    return `https://${
      process.env.NEXT_PUBLIC_S3_BUCKET
    }.s3.process.env.NEXT_PUBLIC_S3_REGION.amazonaws.com/${
      process.env.NEXT_PUBLIC_S3_DIRNAME &&
      process.env.NEXT_PUBLIC_S3_DIRNAME !== ""
        ? process.env.NEXT_PUBLIC_S3_DIRNAME + "/"
        : ""
    }${filename}`;
  } catch (e) {
    console.log("error => ", e);
    return null;
  }
};

/**
 * Read file of S3 bucket
 *
 * @param {String} filename
 *
 * @returns {String}
 */
export const readFile = async (filename, asString = false) => {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: `${
        process.env.NEXT_PUBLIC_S3_DIRNAME &&
        process.env.NEXT_PUBLIC_S3_DIRNAME !== ""
          ? process.env.NEXT_PUBLIC_S3_DIRNAME + "/"
          : ""
      }${filename}`,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    const { Body } = response;

    console.log(Body.streamToString());

    if (asString) {
      return await streamToString(Body);
    } else {
      return Body;
    }
  } catch (e) {
    return null;
  }
};
