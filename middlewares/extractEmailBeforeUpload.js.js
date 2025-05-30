const { formidable } = require("formidable");
const Candidate = require("../models/candidateModel");

const extractEmailBeforeUpload = (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Erreur formulaire:", err);
      return res
        .status(400)
        .json({ message: "Erreur de parsing du formulaire" });
    }

    const emailAddress = fields.emailAddress;

    if (!emailAddress) {
      return res.status(400).json({ message: "Email requis." });
    }

    try {
      const email = emailAddress[0];
      console.log(email);
      const exists = await Candidate.findOne({ emailAddress: email });
      if (exists) {
        return res.status(409).json({ message: "Email déjà utilisé." });
      }
      next();
    } catch (error) {
      console.error("Erreur de vérification email:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
};

module.exports = extractEmailBeforeUpload;
