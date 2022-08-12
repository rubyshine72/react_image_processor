-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalImageUrl" TEXT NOT NULL,
    "originalImageName" TEXT NOT NULL,
    "originalImageType" TEXT NOT NULL,
    "originalImageSize" INTEGER NOT NULL,
    "originalImageWidth" INTEGER NOT NULL,
    "originalImageHeight" INTEGER NOT NULL,
    "compressedImageUrl" TEXT NOT NULL
);
