import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import UserFace from '../Models/UserFace.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// SETUP MULTER FOR FILE UPLOAD
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST route for uploading multiple images
router.post('/api/upload', upload.array('images', 10), (req, res) => {
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    return res.status(200).json({ imagePaths });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

// POST route to save face descriptors
router.post('/api/save-bulk-face', async (req, res) => {
  try {
    const { faces } = req.body;
    if (!faces || !Array.isArray(faces)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    for (const face of faces) {
      const newFace = new UserFace({
        name: face.name,
        descriptor: face.descriptor,
        imageUrl: face.imageUrl,
      });
      await newFace.save();
    }

    return res.status(200).json({ message: 'Faces saved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Saving faces failed' });
  }
});

export default router;
