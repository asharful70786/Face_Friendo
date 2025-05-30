import express from "express";
import UserFace from "../Models/UserFace.js";
import multer from "multer";
import path from "path";
import fs from 'fs';
const router = express.Router();


const calculateDistance = (d1, d2) => {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    const diff = d1[i] - d2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
};


// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Save face
router.post('/save-face', upload.single('image'), async (req, res) => {
  const { name, descriptor } = req.body;

  if (!name || !descriptor || !req.file) {
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
});

// Get all saved faces
router.get('/faces', async (req, res) => {
  const faces = await UserFace.find();
  res.json(faces);
});

router.post('/match-face', async (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor || !Array.isArray(descriptor)) {
    return res.status(400).json({ message: "Invalid descriptor" });
  }

  const threshold = 0.6; // adjust if needed
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
        imageUrl: face.imageUrl || null, // optional, if you store image paths
        _id: face._id
      });
    }
  }

  if (matches.length > 0) {
    return res.json({ match: true, matches });
  } else {
    return res.json({ match: false, message: "No similar faces found." });
  }
});




export default router