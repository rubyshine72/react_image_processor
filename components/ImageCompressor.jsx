import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import Card from "react-bootstrap/Card";
import { v4 as uuidv4 } from "uuid";

import { uploadFile, readFile } from "../libraries/s3";

export default function ImageCompressor() {
  const [compressedLink, setCompressedLink] = useState(
    "http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png"
  );
  const [originalImage, setOriginalImage] = useState("");
  const [originalImageInfo, setOriginalImageInfo] = useState(null);
  const [originalLink, setOriginalLink] = useState("");
  const [outputFileName, setOutputFileName] = useState("");
  const [clicked, setClicked] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);

  const handle = async (e) => {
    const imageFile = e.target.files[0];
    const objectUrl = URL.createObjectURL(imageFile);
    setOriginalLink(objectUrl);
    setOriginalImage(imageFile);
    setOutputFileName(imageFile.name);
    setUploadImage(true);

    let img = new Image();
    img.onload = function () {
      setOriginalImageInfo({
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
        width: this.width,
        height: this.height,
      });
    };
    img.src = objectUrl;
  };

  const click = async (e) => {
    e.preventDefault();

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    if (options.maxSizeMB >= originalImage.size / 1024) {
      alert("Image is too small, can't be Compressed!");
      return 0;
    }

    imageCompression(originalImage, options).then(async (x) => {
      const output = x;

      const params = {
        ACL: "public-read",
        Body: x,
        Bucket: "",
        Key: x.name,
      };

      const downloadLink = URL.createObjectURL(output);
      setCompressedLink(downloadLink);

      // Upload AWS S3
      const uid = uuidv4();
      const originalImageName = `${uid}/original_${originalImage.name}`;
      const compressedImageName = `${uid}/${x.name}`;

      const resultOriginalImage = await uploadFile(
        originalImageName,
        originalImage
      );
      const resultCompressedImage = await uploadFile(compressedImageName, x);

      if (!resultOriginalImage || !resultCompressedImage) {
        alert("Uploading amazon s3 failed!");
        return;
      }

      await fetch("/api/images", {
        method: "POST",
        body: JSON.stringify({
          originalImageUrl: resultOriginalImage,
          originalImageName: originalImageInfo.name,
          originalImageType: originalImageInfo.type,
          originalImageSize: originalImageInfo.size,
          originalImageWidth: originalImageInfo.width,
          originalImageHeight: originalImageInfo.height,
          compressedImageUrl: resultCompressedImage,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf8",
        },
      });
    });

    setClicked(true);
    return 1;
  };

  return (
    <div className="m-5">
      <div className="text-light text-center">
        <h1>Three Simple Steps</h1>
        <h3>1. Upload Image</h3>
        <h3>2. Click on Compress</h3>
        <h3>3. Download Compressed Image</h3>
      </div>

      <div className="row mt-5">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          {uploadImage ? (
            <Card.Img
              className="ht"
              variant="top"
              src={originalLink}
            ></Card.Img>
          ) : (
            <Card.Img
              className="ht"
              variant="top"
              src="http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png"
            ></Card.Img>
          )}

          <div className="d-flex justify-content-center">
            <input
              type="file"
              accept="image/*"
              className="mt-2 btn btn-dark w-75"
              onChange={(e) => handle(e)}
            />
          </div>
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline">
          <br />
          {outputFileName && (
            <button
              type="button"
              className=" btn btn-dark"
              onClick={(e) => click(e)}
            >
              Compress
            </button>
          )}
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
          <Card.Img variant="top" src={compressedLink}></Card.Img>
          {clicked && (
            <div className="d-flex justify-content-center">
              <a
                href={compressedLink}
                download={outputFileName}
                className="mt-2 btn btn-dark w-75"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
