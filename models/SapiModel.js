import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Sapi = db.define('sapi', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    earTag: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    jenisSapi: {
        type: DataTypes.ENUM('Pegon', 'Simental', 'Limousin'),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tanggalMasuk: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    },
    beratAwal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isValidFormat(value) {
                const regex = /^\d+\s*KG$/i;
                if (!regex.test(value)) {
                    throw new Error('Berat harus dalam format "X KG"');
                }
            }
        }
    },
    arsipSapi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    umurMasuk: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isValidFormat(value) {
                const regex = /^\d+,\d{1,2} tahun$/;
                if (!regex.test(value)) {
                    throw new Error('Umur harus dalam format "X,XX tahun"');
                }
            }
        }
    },
    beratSekarang: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
            isValidFormat(value) {
                if (value !== null && value !== undefined) {
                    const regex = /^\d+\s*KG$/i;
                    if (!regex.test(value)) {
                        throw new Error('Berat harus dalam format "X KG"');
                    }
                }
            }
        }
    },
    umurSekarang: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isValidFormat(value) {
                if (value !== null && value !== undefined) {
                    const regex = /^\d+,\d{1,2} tahun$/;
                    if (!regex.test(value)) {
                        throw new Error('Umur harus dalam format "X,XX tahun"');
                    }
                }
            }
        }
    },
    waktuPembaruan: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    konfirmasiVaksinasi: {
        type: DataTypes.ENUM('Sudah Dikonfirmasi', 'Belum Dikonfirmasi'),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: "Belum Dikonfirmasi",
    },
    konfirmasiKelayakan: {
        type: DataTypes.ENUM('Sudah Dikonfirmasi', 'Belum Dikonfirmasi'),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: "Belum Dikonfirmasi",
    },
    konfirmasiVaksinasiUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    konfirmasiKelayakanUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    arsipSertifikat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
    hooks: {
        beforeUpdate: (instance) => {
            console.log('Before Update Hook:', instance.dataValues);
            if (instance.changed("konfirmasiVaksinasi") || instance.changed("arsipSertifikat")) {
                instance.setDataValue("konfirmasiVaksinasiUpdatedAt", new Date());
            }
            if (instance.changed("konfirmasiKelayakan")) {
                instance.setDataValue("konfirmasiKelayakanUpdatedAt", new Date());
            }
            if (instance.changed("beratSekarang") || instance.changed("umurSekarang")) {
                instance.setDataValue("waktuPembaruan", new Date());
            }
        }
    }
});

Users.hasMany(Sapi);
Sapi.belongsTo(Users, { foreignKey: 'userId' });

export default Sapi;
