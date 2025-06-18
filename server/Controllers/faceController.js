import UserFace from "../Models/UserFace.js";



export const saveFace = async (req, res) => {
  const { name, descriptor } = req.body;

  if (!descriptor || !req.file) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const face = new UserFace({
      name,
      descriptor: JSON.parse(descriptor),
      imageUrl: `/uploads/${req.file.filename}`
    });

    await face.save();
    res.json({ message: "Face saved!", imageUrl: face.imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getAllFaces = async (req, res) => {
  const faces = await UserFace.find();
  res.json(faces);
}

export const matchFace = async (req, res) => {
  try {
    const { descriptor } = req.body;

    if (!descriptor || !Array.isArray(descriptor)) {
      return res.status(400).json({ message: "Invalid descriptor" });
    }

    const threshold = 0.9;
    const faces = await UserFace.find();

    const matches = faces.map(face => {
      const distance = calculateDistance(descriptor, face.descriptor);
      const similarity = (1 - (distance / threshold)) * 100;

      return similarity >= 40
        ? {
            name: face.name,
            distance,
            similarity: similarity.toFixed(2),
            imageUrl: face.imageUrl || null,
            _id: face._id
          }
        : null;
    }).filter(Boolean);

    if (matches.length > 0) {
      return res.json({ match: true, matches });
    } else {
      return res.json({ match: false, message: "No similar faces found." });
    }

  } catch (error) {
    console.error("Error matching face:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const calculateDistance = (d1, d2) => {
  return Math.sqrt(d1.reduce((sum, val, i) => sum + Math.pow(val - d2[i], 2), 0));
};
