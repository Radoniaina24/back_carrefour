const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Candidate = require("../models/candidateModel");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configuration de Multer avec stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const emailAddress = req.body.emailAddress;
    if (!req.emailChecked) {
      const exists = await Candidate.findOne({ emailAddress });
      if (exists) {
        const error = new Error("Email déjà utilisé.");
        error.statusCode = 409;
        throw error;
      }
      req.emailChecked = true; // éviter double vérification pour les autres fichiers
    }
    // Extraire le nom original du fichier sans l'extension
    const originalName = file.originalname
      .split(".")
      .slice(0, -1)
      .join("_")
      .replace(/\s+/g, "_");

    // Récupérer la date du jour (format YYYYMMDD)
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    const isImage = file.mimetype.startsWith("image/");
    const isPdf = file.mimetype === "application/pdf";

    let options = {
      folder: "Candidature Candidate",
      public_id: `${originalName}_${formattedDate}`,
    };

    if (isImage) {
      options.format = "jpg"; // Convertit toutes les images en JPG
    } else if (isPdf) {
      options.resource_type = "raw"; // Définit les PDFs comme fichiers bruts
      options.format = "pdf";
    }
    return options;
  },
});

const upload = multer({ storage: storage });

const uploadFile = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "degree", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 },
]);

module.exports = {
  uploadFile,
};
