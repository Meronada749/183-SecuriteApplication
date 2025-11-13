import express from "express";
import { connectToDatabase } from "../utils/dbUtils.mjs";


const router = express.Router();

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


router.post('/', connectToDatabaseMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const queryString = 'SELECT * FROM t_users WHERE useName = ? AND usePassword = ?'; 

  try {
    const [rows] = await req.dbConnection.execute(queryString, [username, password]);
    if (rows.length > 0) {
      res.status(200).json({ message: "Authentication successful" });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
