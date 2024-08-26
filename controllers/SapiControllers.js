import Sapi from "../models/SapiModel.js";
import Users from "../models/UserModel.js";
import transporter from "../middleware/emailConfig.js";
import { Op } from "sequelize";
export const getSapi = async (req, res) => {
    try {
        const response = await Sapi.findAll({
            attributes:[
                'uuid',
                'earTag',
                'jenisSapi',
                'tanggalMasuk',
                'beratAwal',
                'umurMasuk',
                'createdAt',
                'beratSekarang',
                'umurSekarang',
                'waktuPembaruan',
                'konfirmasiVaksinasi',
                'konfirmasiVaksinasiUpdatedAt',
                'konfirmasiKelayakan',
                'konfirmasiKelayakanUpdatedAt',
                'arsipSapi',
                'arsipSertifikat'
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    } 
};

export const getSapiById = async (req, res) => {    
    try {
        const response = await Sapi.findOne({
            where: { uuid: req.params.id }, 
            attributes: [
                'uuid',
                'earTag',
                'jenisSapi',
                'tanggalMasuk',
                'beratAwal',
                'umurMasuk',
                'createdAt',
                'beratSekarang',
                'umurSekarang',
                'waktuPembaruan',
                'konfirmasiVaksinasi',
                'konfirmasiVaksinasiUpdatedAt',
                'konfirmasiKelayakan',
                'konfirmasiKelayakanUpdatedAt',
                'arsipSapi',
                'arsipSertifikat'
            ],
        });
        if (!response) {
            return res.status(404).json({ msg: "Data sapi tidak ditemukan" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createSapi = async (req, res) => {
    try {
        const { earTag, jenisSapi, tanggalMasuk, beratAwal, umurMasuk, arsipSapi } = req.body;

        const existingSapi = await Sapi.findOne({ where: { earTag: earTag } });
        if (existingSapi) {
            return res.status(400).json({ msg: "EarTag sudah digunakan" });
        }

        const newSapi = await Sapi.create({
            earTag: earTag,
            jenisSapi: jenisSapi,
            tanggalMasuk: tanggalMasuk,
            beratAwal: beratAwal,
            umurMasuk: umurMasuk,
            arsipSapi: arsipSapi,
            userId: req.userId
        });


        const users = await Users.findAll({
            attributes: ['email']
        });

        const emailRecipients = users.map(user => user.email).join(', ');


        const mailOptions = {
            from: 'fabricternak@gmail.com', 
            to: emailRecipients,
            subject: 'Data Sapi Baru Telah Ditambahkan',
            text: `Data sapi baru dengan EarTag ${newSapi.earTag} telah ditambahkan ke sistem oleh peternak.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error saat mengirim email:', error);
            } else {
                console.log('Email berhasil dikirim:', info.response);
            }
        });

        res.status(200).json({ msg: "Data sapi berhasil ditambahkan", data: newSapi });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateSapi = async (req, res) => {
    try {
        const sapi = await Sapi.findOne({
            where: {
                uuid: req.params.id
            },
        });
        if (!sapi) return res.status(404).json({ msg: "Data sapi tidak ditemukan" });
        const {
            earTag,
            beratSekarang,
            umurSekarang,
            waktuPembaruan,
            konfirmasiVaksinasi,
            konfirmasiVaksinasiUpdatedAt,
            konfirmasiKelayakan,
            konfirmasiKelayakanUpdatedAt,
            arsipSertifikat

        } = req.body;

        const updatedData = {
            earTag: earTag || sapi.earTag,
            beratSekarang: beratSekarang || sapi.beratSekarang,
            umurSekarang: umurSekarang || sapi.umurSekarang,
            waktuPembaruan: waktuPembaruan || sapi.waktuPembaruan,
            konfirmasiVaksinasi: konfirmasiVaksinasi || sapi.konfirmasiVaksinasi,
            konfirmasiVaksinasiUpdatedAt: konfirmasiVaksinasiUpdatedAt || sapi.konfirmasiVaksinasiUpdatedAt,
            konfirmasiKelayakan: konfirmasiKelayakan || sapi.konfirmasiKelayakan,
            konfirmasiKelayakanUpdatedAt: konfirmasiKelayakanUpdatedAt || sapi.konfirmasiKelayakanUpdatedAt,
            arsipSertifikat: arsipSertifikat || sapi.arsipSertifikat,
        };

        if (req.role === "Admin" || req.role === "Peternak" || req.role === "DKPP") {
            await Sapi.update(updatedData, {
                where: {
                    id: sapi.id
                }
            });
        } else {
            if (req.userId !== sapi.userId) return res.status(403).json({ msg: "Akses ditolak" });
            await Sapi.update(updatedData, {
                where: {
                    [Op.and]: [
                        { id: sapi.id },
                        { userId: req.userId }
                    ]
                }
            });
        }

        res.status(200).json({ msg: "Data sapi berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating sapi:", error); // Added error logging
        res.status(500).json({ msg: error.message });
    }
};


export const deleteSapi = async (req, res) => { 
    try {
        const sapi = await Sapi.findOne({
            where: {
                uuid: req.params.id
            },
        });
        if(!sapi)
             return res.status(404).json({msg: "Data sapi tidak ditemukan"});
        const {
            earTag,
            beratSekarang,
            umurSekarang,
            konfirmasiVaksinasi,
            konfirmasiVaksinasiUpdatedAt,
            konfirmasiKelayakan,
            konfirmasiKelayakanUpdatedAt,
            arsipSapi,
            arsipSertifikat
        } = req.body;
        if (
            req.role === "Admin" || req.role === "Peternak"){
            await Sapi.destroy({
                where: {
                    id: sapi.id
                }
            });
        } else {
            if(req.userId !== sapi.userId) return res.status(403).json({msg: "Akses ditolak"});
            await Sapi.destroy({
                where: {
                    [Op.and]: [
                        { id: sapi.id },
                         { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Data sapi berhasil di hapus!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

