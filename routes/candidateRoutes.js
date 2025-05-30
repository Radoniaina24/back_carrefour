const express = require("express");
const candidateRouter = express.Router();
const candidateController = require("../controllers/candidateController");
const { uploadFile } = require("../utils/cloudinary");

// Créer un application
candidateRouter.post("/", uploadFile, candidateController.createCandidate);
// Obternir tous les candidatures
candidateRouter.get("/", candidateController.getAllCandidate);
// // Obternir un  candidature par son Id
// candidateRouter.get("/:id", applicationController.getApplicationById);
// // Supprimer un  candidature par son Id
// candidateRouter.delete("/:id", applicationController.deleteApplication);
// modifier un  candidature par son Id
candidateRouter.put("/:id", candidateController.updateCandidate);

module.exports = candidateRouter;
