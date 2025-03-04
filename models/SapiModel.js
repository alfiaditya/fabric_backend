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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
            isFloat: true
        },
        get() {
            const value = this.getDataValue('beratAwal');
            return value ? `${value} KG` : null;
        },
        set(value) {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue)) {
                throw new Error('Berat harus berupa angka yang valid');
            }
            this.setDataValue('beratAwal', numericValue);
        }
    },
    arsipSapi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    umurMasuk: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
            isFloat: true
        },
        get() {
            const value = this.getDataValue('umurMasuk');
            return value ? `${value.toFixed(2)} Tahun` : null;
        },
        set(value) {
            const numericValue = parseFloat(value.replace(',', '.'));
            if (isNaN(numericValue)) {
                throw new Error('Umur harus berupa angka yang valid');
            }
            this.setDataValue('umurMasuk', numericValue);
        }
    },
    beratSekarang: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: true
        },
        get() {
            const value = this.getDataValue('beratSekarang');
            return value ? `${value} KG` : null;
        },
        set(value) {
            if (value !== null && value !== undefined) {
                const numericValue = parseFloat(value);
                if (isNaN(numericValue)) {
                    throw new Error('Berat harus berupa angka yang valid');
                }
                this.setDataValue('beratSekarang', numericValue);
            }
        }
    },
    umurSekarang: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: true
        },
        get() {
            const value = this.getDataValue('umurSekarang');
            return value ? `${value.toFixed(2)} Tahun` : null;
        },
        set(value) {
            if (value !== null && value !== undefined) {
                const numericValue = parseFloat(value.replace(',', '.'));
                if (isNaN(numericValue)) {
                    throw new Error('Umur harus berupa angka yang valid');
                }
                this.setDataValue('umurSekarang', numericValue);
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
