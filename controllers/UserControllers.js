import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'nama', 'email', 'role', 'statusPengguna', 'createdAt']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'nama', 'email', 'role', 'statusPengguna', 'createdAt'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const validatePassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password harus minimal 8 karakter.');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('Password harus memiliki setidaknya satu huruf besar.');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('Password harus memiliki setidaknya satu angka.');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        throw new Error('Password harus memiliki setidaknya satu simbol.');
    }
};

export const createUser = async (req, res) => {
    const { nama, email, password, confPassword, role, statusPengguna } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah digunakan" });
        }

        validatePassword(password); // Validasi password
        const hashPassword = await argon2.hash(password);
        await User.create({
            nama: nama,
            email: email,
            password: hashPassword,
            role: role,
            statusPengguna: statusPengguna
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const { nama, email, password, confPassword, role, statusPengguna } = req.body;

    if (password && password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

    let hashPassword = user.password;
    if (password && password !== "") {
        try {
            validatePassword(password); // Validasi password
            hashPassword = await argon2.hash(password);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email: email } });
            if (existingUser) {
                return res.status(400).json({ msg: "Email sudah digunakan" });
            }
        }

        await User.update({
            nama: nama || user.nama,
            email: email || user.email,
            password: hashPassword,
            role: role || user.role,
            statusPengguna: statusPengguna || user.statusPengguna,
        }, {
            where: {
                uuid: user.uuid
            }
        });
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

