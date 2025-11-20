// import express from "express";
// import { connectToDatabase } from "../utils/dbUtils.mjs";

// const router = express.Router();

// // Middleware pour la connexion à la base de données
// const connectToDatabaseMiddleware = async (req, res, next) => {
//   try {
//     req.dbConnection = await connectToDatabase();
//     next();
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// router.post("/", connectToDatabaseMiddleware, async (req, res) => {
//   const { username, password } = req.body;

//   const queryString =
//     "SELECT * FROM t_users WHERE useName = ? AND usePassword = ?";

//   try {
//     const [rows] = await req.dbConnection.execute(queryString, [
//       username,
//       password,
//     ]);
//     if (rows.length > 0) {
//       res.status(200).json({ message: "Authentication successful" });
//     } else {
//       res.status(401).json({ error: "Invalid username or password" });
//     }
//   } catch (error) {
//     console.error("Error authenticating user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }

//   // Route de test pour vérifier les droits restreints
//   router.get("/isDropped", connectToDatabaseMiddleware, async (req, res) => {
//     try {
//       await req.dbConnection.query("DROP DATABASE db_authentication");

//       return res.status(200).json({
//         message: "DATABASE DROPPED.",
//       });
//     } catch (error) {
//       console.error("Expected permission error:", error.code, error.sqlMessage);

//       return res.status(200).json({
//         message: "Don't have privileges to DROP DATABASE",
//         dbErrorCode: error.code,
//       });
//     }
//   });
// });

// export default router;

////////////////////////   Nouveau code exercice 5 : protection des données ///////////////////////////.
import express from "express";
import crypto from "crypto";
import { connectToDatabase } from "../utils/dbUtils.mjs";

const router = express.Router();

// ⚠️ Pour un vrai projet: mettre ce pepper dans process.env
const PEPPER = "SuperSecretPepperChangeMe";

// Middleware pour la connexion à la base de données
const connectToDatabaseMiddleware = async (req, res, next) => {
  try {
    req.dbConnection = await connectToDatabase();
    next();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fonction de hachage mot de passe + salt + pepper
function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt + PEPPER)
    .digest("hex");
}

// Authentification avec hash + salt + pepper
router.post("/", connectToDatabaseMiddleware, async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1) On récupère l'utilisateur par son username
    const [rows] = await req.dbConnection.execute(
      "SELECT usePassword, useSalt FROM t_users WHERE useName = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    // 2) On recalcule le hash à partir du mot de passe fourni
    const computedHash = hashPassword(password, user.useSalt);

    // 3) On compare le hash calculé avec celui en DB
    if (computedHash === user.usePassword) {
      return res.status(200).json({ message: "Authentication successful" });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route de test des permissions (point 4)
router.get(
  "/test-permissions",
  connectToDatabaseMiddleware,
  async (req, res) => {
    try {
      await req.dbConnection.query("DROP DATABASE db_authentication");

      return res.status(200).json({
        message:
          "ATTENTION: DROP DATABASE a réussi. L'utilisateur a trop de privilèges.",
      });
    } catch (error) {
      console.error("Expected permission error:", error.code, error.sqlMessage);

      return res.status(200).json({
        message: "Opération interdite bloquée comme prévu (moindres privilèges).",
        dbErrorCode: error.code,
      });
    }
  }
);

export default router;