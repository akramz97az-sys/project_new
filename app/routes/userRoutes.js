// backend-api/app/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController'); 
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;