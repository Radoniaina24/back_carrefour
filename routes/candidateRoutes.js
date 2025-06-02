const express = require("express");
const candidateRouter = express.Router();
const candidateController = require("../controllers/candidateController");
const { uploadFile } = require("../utils/cloudinary");

candidateRouter.post("/", uploadFile, candidateController.createCandidate);
candidateRouter.get("/", candidateController.getAllCandidate);
candidateRouter.put("/:id", candidateController.updateCandidate);
candidateRouter.delete("/:id", candidateController.deletCandidate);
module.exports = candidateRouter;
