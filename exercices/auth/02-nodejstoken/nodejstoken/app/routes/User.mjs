import express from "express";
import { get } from "../controllers/UserController.mjs";

const router = express.Router();
router.get('/', get);

export default router;