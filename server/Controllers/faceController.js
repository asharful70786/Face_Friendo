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
  const { descriptor } = req.body;

  if (!descriptor || !Array.isArray(descriptor)) {
    return res.status(400).json({ message: "Invalid descriptor" });
  }

  const threshold = 0.9; 
  const matches = [];

  const faces = await UserFace.find();
  for (let face of faces) {
    const distance = calculateDistance(descriptor, face.descriptor);
    const similarity = (1 - (distance / threshold)) * 100;
    if (similarity >= 40) {
      matches.push({
        name: face.name,
        distance,
        similarity: similarity.toFixed(2),
        imageUrl: face.imageUrl || null,
        _id: face._id
      });
    }
  }

  if (matches.length > 0) {
    return res.json({ match: true, matches });
  } else {
    return res.json({ match: false, message: "No similar faces found." });
  }
}
const calculateDistance = (d1, d2) => {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    const diff = d1[i] - d2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
};