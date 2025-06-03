const mongoose = require("mongoose");

const RecruiterSchema = new mongoose.Schema(
  {
    // Informations personnelles
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["approved", "unapproved"],
      default: "unapproved",
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);
const Recruiter = mongoose.model("Recruiter", RecruiterSchema);
module.exports = Recruiter;
