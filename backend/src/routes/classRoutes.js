const express = require('express');
const router = express.Router();
const classControllers = require('../controllers/classControllers');

router.get('/', classControllers.getClasses);

router.post('/', classControllers.createClass); 

module.exports = router;