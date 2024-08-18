import express from "express";
import { 
    getSapi,
    getSapiById,
    createSapi, 
    updateSapi, 
    deleteSapi
 } from "../controllers/SapiControllers.js";
import { verifyUser, adminOnly} from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/sapi', verifyUser, getSapi);
router.get('/sapi/:id', verifyUser, getSapiById);
router.post('/sapi', verifyUser, createSapi);
router.patch('/sapi/:id',verifyUser, updateSapi);
router.delete('/sapi/:id',verifyUser, deleteSapi);

export default router;