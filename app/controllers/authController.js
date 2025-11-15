const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 💡 PASTIKAN KUNCI RAHASIA INI SAMA DENGAN YANG DI authMiddleware.js
const JWT_SECRET = 'KUNCI_RAHASIA_ANDA_YANG_SANGAT_PANJANG_DAN_SULIT';

// --- REGISTER ---
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "Semua kolom harus diisi." });

    try {
        // Cek apakah email sudah terdaftar
        const [existingUser] = await db.execute('SELECT email FROM user WHERE email = ?', [email]);
        if (existingUser.length > 0) return res.status(409).json({ message: 'Email sudah terdaftar.' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database
        await db.execute(
            'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'Registrasi berhasil!' });

    } catch (error) {
        console.error("Error Registrasi:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

// --- LOGIN (Sudah DIBERSIHKAN) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email dan password harus diisi." });

    try {
        // 1. Cari pengguna berdasarkan email
        const [users] = await db.execute('SELECT id, username, email, password FROM user WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: 'Email atau password salah.' });

        const user = users[0];
        
        // 2. Bandingkan password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: 'Email atau password salah.' });

        // 3. Buat Token JWT
        const token = jwt.sign(
            { id: user.id }, 
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. Kirim Token ke Frontend
        res.status(200).json({
            message: 'Login berhasil!',
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("Error Login:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};