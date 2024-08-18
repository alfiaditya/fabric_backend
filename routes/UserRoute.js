import express from "express";
import { 
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
 } from "../controllers/UserControllers.js";
import { verifyUser, adminOnly} from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUser);
router.patch('/users/:id', verifyUser , adminOnly, updateUser);
router.delete('/users/:id', verifyUser , adminOnly, deleteUser);

export default router;
