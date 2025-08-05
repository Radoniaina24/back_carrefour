const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const { globalErrHandler, notFound } = require("./middlewares/globaErrHandler");
const path = require("path");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:3000",
  "https://carrefour-emploi-etudes.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    // autoriser les requêtes sans origin (comme Postman) ou celles venant d'une origine valide
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const port = process.env.PORT;
dbConnect();
app.use(express.json());
// ***********//

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
//routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/recruiter", recruiterRoutes);
//Gestion des erreurs
app.use(notFound);
app.use(globalErrHandler);
