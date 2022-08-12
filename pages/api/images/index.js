import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createImage = async (req, res) => {
  const data = req.body;
  try {
    const image = await prisma.image.create({ data });
    res.status(200).json({ status: true, image });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured." });
  }
};

const getImages = async (req, res) => {
  try {
    const count = parseInt(req.query.count || "10", 10);
    const skip = parseInt(req.query.skip || "0", 10);

    const totalCount = await prisma.image.count();
    const images = await prisma.image.findMany({
      skip,
      take: count,
    });
    res.status(200).json({
      totalCount,
      count,
      skip,
      images,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured." });
  }
};

export default async (req, res) => {
  if (req.method === "POST") {
    await createImage(req, res);
    return;
  }

  await getImages(req, res);
};
