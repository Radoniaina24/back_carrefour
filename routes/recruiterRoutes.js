const express = require("express");
const recruiterRouter = express.Router();
const recruiterController = require("../controllers/recruiterController");

recruiterRouter.post("/", recruiterController.createRecruiter);
recruiterRouter.get("/", recruiterController.getAllRecruiter);
recruiterRouter.put("/:id", recruiterController.updateRecruiter);
recruiterRouter.delete("/:id", recruiterController.deletRecruiter);
module.exports = recruiterRouter;
