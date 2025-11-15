// backend-api/app/controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 0. READ ALL (Mengambil SEMUA data user untuk dashboard/list)
exports.getAllUsers = async (req, res) => {
    try {
        // Hanya ambil ID, username, dan email
        const [users] = await db.execute('SELECT id, username, email FROM user'); 
        res.status(200).json({ users: users });
    } catch (error) {
        console.error("Error READ ALL users:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil daftar pengguna.' });
    }
};

// 1. READ (Mengambil data user berdasarkan ID)
exports.getUserById = async (req, res) => {
    // Ambil ID dari parameter URL (misalnya /api/users/12)
    const userId = req.params.id; 

    try {
        const [users] = await db.execute('SELECT id, username, email FROM user WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({ user: users[0] });

    } catch (error) {
        console.error("Error READ user:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data.' });
    }
};

// 2. UPDATE (Mengubah data user)
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, newPassword } = req.body;

    try {
        let sql = 'UPDATE user SET username = ?, email = ?';
        const params = [username, email];

        // Jika ada password baru, hash dan tambahkan ke query
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            sql += ', password = ?';
            params.push(hashedPassword);
        }

        sql += ' WHERE id = ?';
        params.push(userId);

        const [result] = await db.execute(sql, params);

        if (result.affectedRows === 0) {
             return res.status(404).json({ message: 'Pengguna tidak ditemukan atau tidak ada perubahan data.' });
        }

        res.status(200).json({ message: 'Data pengguna berhasil diperbarui.' });

    } catch (error) {
        console.error("Error UPDATE user:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat memperbarui data.' });
    }
};

// 3. DELETE (Menghapus user)
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await db.execute('DELETE FROM user WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({ message: 'Pengguna berhasil dihapus.' });

    } catch (error) {
        console.error("Error DELETE user:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat menghapus data.' });
    }
};