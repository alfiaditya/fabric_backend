import express from "express";
import { Me, Login, logOut } from "../controllers/AuthControllers.js";

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.delete('/logout', logOut);

export default router;