const express = require('express');
const router = express.Router();
const { getDistrictStats, getCategoryStats } = require('../controllers/statsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/district', verifyToken, getDistrictStats);
router.get('/category', verifyToken, getCategoryStats);

module.exports = router;