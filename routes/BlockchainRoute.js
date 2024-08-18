import express from 'express';
import { uploadToBlockchain, getAllPencatatanSapi, getPencatatanSapiByEarTag } from '../controllers/BlockchainControllers.js';

const router = express.Router();

router.post('/simpan', uploadToBlockchain);
router.get('/TernakSapi', getAllPencatatanSapi);
router.get('/TernakSapi/:earTag', getPencatatanSapiByEarTag);

export default router;
