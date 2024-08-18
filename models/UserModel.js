import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isComplexEnough(value) {
                if (value.length < 8) {
                    throw new Error('Password harus minimal 8 karakter.');
                }
                if (!/[A-Z]/.test(value)) {
                    throw new Error('Password harus memiliki setidaknya satu huruf besar.');
                }
                if (!/[0-9]/.test(value)) {
                    throw new Error('Password harus memiliki setidaknya satu angka.');
                }
                if (!/[^A-Za-z0-9]/.test(value)) {
                    throw new Error('Password harus memiliki setidaknya satu simbol.');
                }
            }
        }
    },
    role:{
        type: DataTypes.ENUM('Admin', 'Peternak','DKPP'),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    statusPengguna: {
        type: DataTypes.ENUM('belum ter-verifikasi', 'sudah ter-verifikasi'),
        allowNull: false,
        defaultValue: 'belum ter-verifikasi',
        validate: {
            notEmpty: true
        }
    }
} , {
    freezeTableName: true,
    timestamps: true
} );

export default Users;