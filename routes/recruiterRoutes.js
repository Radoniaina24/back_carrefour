const express = require("express");
const recruiterRouter = express.Router();
const recruiterController = require("../controllers/recruiterController");

recruiterRouter.post("/", recruiterController.createRecruiter);
recruiterRouter.get("/", recruiterController.getAllRecruiter);
// recruiterRouter.put("/:id", candidateController.updateCandidate);
// recruiterRouter.delete("/:id", candidateController.deletCandidate);
module.exports = recruiterRouter;
