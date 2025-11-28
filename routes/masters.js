const express = require('express');
const router = express.Router();

const mastersController = require('../controllers/masters');
const validation = require('../middleware/validate');
const auth = require('../middleware/authenticate');

router.get('/', mastersController.getAll);

router.get('/:id', mastersController.getSingle);

router.post('/', auth.isAuthenticated, validation.saveMasters, mastersController.createMasters);

router.put('/:id', auth.isAuthenticated, validation.saveMasters, mastersController.updateMasters);

router.delete('/:id', auth.isAuthenticated, mastersController.deleteMasters);


module.exports = router;