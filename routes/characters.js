const express = require('express');
const router = express.Router();

const charactersController = require('../controllers/characters');
const validation = require('../middleware/validate');
const auth = require('../middleware/authenticate');

router.get('/', charactersController.getAllCharacter);

router.get('/:id', charactersController.getSingleCharacter);

router.post('/', auth.isAuthenticated, validation.saveCharacters, charactersController.createCharacter);

router.put('/:id', auth.isAuthenticated, validation.saveCharacters, charactersController.updateCharacter);

router.delete('/:id', auth.isAuthenticated, charactersController.deleteCharacter);

module.exports = router;