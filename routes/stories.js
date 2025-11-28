const express = require('express');
const router = express.Router();

const storiesController = require('../controllers/stories');
const validation = require('../middleware/validate');
const auth = require('../middleware/authenticate');

router.get('/', storiesController.getAllStories);

router.get('/:id', storiesController.getSingleStories);

router.post('/', auth.isAuthenticated, validation.saveStories, storiesController.createStories);

router.put('/:id', auth.isAuthenticated, validation.saveStories, storiesController.updateStories);

router.delete('/:id', auth.isAuthenticated, storiesController.deleteStories);

module.exports = router;