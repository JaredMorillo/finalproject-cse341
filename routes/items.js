const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/items');
const validation = require('../middleware/validate');
const auth = require('../middleware/authenticate');

router.get('/', itemsController.getAllItems);

router.get('/:id', itemsController.getSingleItems);

router.post('/', auth.isAuthenticated, validation.saveItems, itemsController.createItems);

router.put('/:id', auth.isAuthenticated, validation.saveItems, itemsController.updateItems);

router.delete('/:id', auth.isAuthenticated, itemsController.deleteItems);

module.exports = router;