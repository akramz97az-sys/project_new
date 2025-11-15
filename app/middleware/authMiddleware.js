// backend-api/app/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'KUNCI_RAHASIA_ANDA_YANG_SANGAT_PANJANG_DAN_SULIT'; 

const protect = (req, res, next) => {
    // 1. Ambil token dari header
    let token;
    
    // Asumsi token dikirim di header Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Tidak ada token otentikasi.' });
    }

    try {
        // 2. Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Tambahkan ID pengguna dari token ke objek request
        req.userId = decoded.id; 
        
        next();
        
    } catch (error) {
        console.error("Token tidak valid:", error);
        res.status(401).json({ message: 'Token tidak valid. Silakan login ulang.' });
    }
};

module.exports = protect;