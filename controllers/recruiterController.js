const Recruiter = require("../models/recruiterModel");
const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");
// POST /api/candidate
const createRecruiter = async (req, res) => {
  try {
    // Récupération des données depuis le body
    const { lastName, firstName, emailAddress, country, company, password } =
      req.body;
    // verification si 'email est déja utilisé
    const emailExist = await User.findOne({ email: emailAddress });
    if (emailExist) {
      return res
        .status(401)
        .json({ message: "Cette email est déja utilisé ." });
    }
    // Création du recruteur
    const newRecruiter = new Recruiter({
      lastName,
      firstName,
      emailAddress,
      country,
      company,
      password,
    });
    await newRecruiter.save();
    // création de l'utilisateur candidate
    const role = "recruiter";
    const user = new User({
      lastName: newRecruiter.lastName,
      firstName: newRecruiter.firstName,
      email: newRecruiter.emailAddress,
      password: password,
      role,
      recruiter: newRecruiter._id,
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
// GET /api/recruiter
const getAllRecruiter = async (req, res) => {
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

    const totalRecruiters = await Recruiter.countDocuments(filters);
    const totalPages = Math.ceil(totalRecruiters / limit);

    const recruiters = await Recruiter.find(filters)
      .sort({
        createdAt: sortOption,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      totalRecruiters,
      totalPages,
      currentPage: parseInt(page),
      recruiters,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Delete /api/candidate
const deletRecruiter = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Recruiter.findById(id);
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
    await Recruiter.deleteOne({ _id: id });

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
const updateRecruiter = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log(req.body);
    const candidate = await Recruiter.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidat non trouvée" });
    }

    candidate.status = status || candidate.status;
    await candidate.save();

    // Modification de status de l'utilisateur
    const user = await User.findOne({ candidate: candidate._id });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvée" });
    }

    user.status = "paid";
    await user.save();

    //envoi mail pour confirmation

    res
      .status(200)
      .json({ message: "Status mise à jour avec succès", candidate });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  createRecruiter,
  getAllRecruiter,
  //   updateRecruiter,
  //   deletRecruiter,
};
