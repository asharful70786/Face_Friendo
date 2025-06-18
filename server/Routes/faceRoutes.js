import express from "express";
import UserFace from "../Models/UserFace.js";
import multer from "multer";
import path from "path";
import { getAllFaces, matchFace, saveFace } from "../Controllers/faceController.js";
import { authMiddleWare } from "../MiddleWares/authMiddleWare.js";
const router = express.Router();

// Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({ storage });

// router.post('/save-face', upload.single('image'), saveFace);


router.get('/faces', authMiddleWare, getAllFaces);

router.post('/match-face', authMiddleWare, matchFace);








export default router