const Candidate = require("../models/candidateModel");
const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");
// POST /api/candidate
const createCandidate = async (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ message: "Veuillez télécharger les fichiers requis." });
  }
  const uploadedFiles = {};

  Object.keys(req.files).forEach((key) => {
    uploadedFiles[key] = {
      url: req.files[key][0].path,
      publicId: req.files[key][0].filename,
      type: req.files[key][0].mimetype.startsWith("image/") ? "image" : "pdf",
    };
  });
  try {
    // Récupération des données depuis le body
    const {
      lastName,
      firstName,
      emailAddress,
      confirmEmailAddress,
      phoneNumber,
      dateOfBirth,
      nationality,
      address,
      city,
      postalCode,
      country,
      sector,
      category,
      password,
    } = req.body;

    if (emailAddress !== confirmEmailAddress) {
      return res
        .status(400)
        .json({ message: "Les adresses e-mail ne correspondent pas." });
    }
    // Création du canditate
    const newCandidate = new Candidate({
      lastName,
      firstName,
      emailAddress,
      phoneNumber,
      dateOfBirth,
      nationality,
      address,
      city,
      postalCode,
      country,
      sector,
      category,
      coverLetter: uploadedFiles.coverLetter,
      cv: uploadedFiles.cv,
      degree: uploadedFiles.degree,
      photo: uploadedFiles.photo,
      acceptConditions: true,
    });
    await newCandidate.save();
    // création de l'utilisateur candidate
    const role = "candidate";
    const user = new User({
      lastName: newCandidate.lastName,
      firstName: newCandidate.firstName,
      email: newCandidate.emailAddress,
      password: password,
      role,
      candidate: newCandidate._id,
      status: "unpaid",
    });
    await user.save();

    return res.status(201).json({
      message: "Candidature soumise avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la soumission de candidature :", error);
    return res
      .status(500)
      .json({ message: "Une erreur interne s'est produite." });
  }
};
// GET /api/candidate
const getAllCandidate = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort, status } = req.query;
    // Construction dynamique des filtres
    const filters = {};

    if (search) {
      filters.$or = [
        { lastName: { $regex: search, $options: "i" } },
        {
          firstName: { $regex: search, $options: "i" },
        },
      ];
    }
    if (status && status !== "all") {
      filters.status = status;
    }
    const sortOption = sort === "asc" ? 1 : -1;

    const totalCandidates = await Candidate.countDocuments(filters);
    const totalPages = Math.ceil(totalCandidates / limit);

    const candidates = await Candidate.find(filters)
      .sort({
        createdAt: sortOption,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      totalCandidates,
      totalPages,
      currentPage: parseInt(page),
      candidates,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Delete /api/candidate
const deletCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    // Suppression du fichier dans cloudinary
    const resourceType = candidate.cv.type === "pdf" ? "raw" : "image";
    const documentsToDelete = [
      { key: "cv", type: resourceType },
      { key: "degree", type: resourceType },
      { key: "photo", type: "image" },
      { key: "coverLetter", type: resourceType },
    ];

    for (const doc of documentsToDelete) {
      const file = candidate[doc.key];
      if (file?.publicId) {
        try {
          await cloudinary.uploader.destroy(file.publicId, {
            resource_type: doc.type,
          });
          console.log(`✅ ${doc.key} supprimé avec succès.`);
        } catch (error) {
          console.error(
            `❌ Erreur lors de la suppression de ${doc.key} :`,
            error
          );
        }
      } else {
        console.warn(`⚠️ Aucun fichier trouvé pour ${doc.key}.`);
      }
    }
    // Suppression du Candidature
    await Candidate.deleteOne({ _id: id });

    // Supression de l'utilisateur
    const user = await User.findOne({ candidate: candidate._id });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvée" });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: "Candidature supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
// PUT /api/candidate
const updateCandidate = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log(req.body);
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidat non trouvée" });
    }

    candidate.status = status || candidate.status;
    await candidate.save();
    //create new user
    // const role = "candidate";
    // if (candidate.status === "approved") {
    //   const user = new User({
    //     lastName: candidate.lastName,
    //     firstName: candidate.firstName,
    //     email: candidate.emailAddress,
    //     password: "123456789a",
    //     role,
    //     candidate: candidate._id,
    //   });
    //   await user.save();
    // }

    res
      .status(200)
      .json({ message: "Status mise à jour avec succès", candidate });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  createCandidate,
  getAllCandidate,
  updateCandidate,
  deletCandidate,
};
