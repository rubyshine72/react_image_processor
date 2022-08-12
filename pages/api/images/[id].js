import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteImage = async (id, res) => {
  try {
    const deletedimage = await prisma.image.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ status: true, deletedimage });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured." });
  }
};

const getImage = async (id, res) => {
  try {
    const image = await prisma.image.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json(image);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured." });
  }
};

export default async (req, res) => {
  const { id } = req.query;
  if (req.method === "DELETE") {
    await deleteImage(id, res);
    return;
  }

  await getImage(id, res);
};
