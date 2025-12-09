const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/register', userControllers.registerUser); 
router.post('/login', userControllers.loginUser); 

router.get('/tutor/:id', userControllers.getTutorProfile); 

router.get('/tutores', userControllers.getAllTutors); 

router.post('/follow/:tutorId', protect, userControllers.toggleFollow);

router.get('/follows', protect, userControllers.getFollowedTutors);

module.exports = router;