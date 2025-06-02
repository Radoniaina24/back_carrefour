const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
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
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    // Choix du secteur
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
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
    // Documents
    coverLetter: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      type: { type: String, required: true },
    },
    cv: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      type: { type: String, required: true },
    },
    degree: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      type: { type: String, required: true },
    },
    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      type: { type: String, required: true },
    },
    // Confirmation
    acceptConditions: { type: Boolean, default: false },
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);
const Candidate = mongoose.model("Candidate", CandidateSchema);
module.exports = Candidate;
