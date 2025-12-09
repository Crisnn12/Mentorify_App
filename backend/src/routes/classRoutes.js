const express = require('express');
const router = express.Router();
const classController = require('../controllers/classControllers');

router.get('/live', classController.getLiveClasses); 
router.get('/', classController.getClasses);
router.get('/:id', classController.getClassById); 
router.post('/', classController.createClass); 


module.exports = router;