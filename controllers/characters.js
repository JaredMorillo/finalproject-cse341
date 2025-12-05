const db = require("../database/db");
const { ObjectId } = require('mongodb');

const getAllCharacter = async (req, res) => {
    try {
        const lists = await db.getDatabase().collection('characters').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding your character', error: err.message });
    }
};

const getSingleCharacter = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid character id' });
    }
    try {
        const charactersId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('characters').findOne({ _id: charactersId });
        if (!result) return res.status(404).json({ message: 'Character not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding character', error: err.message });
    }
};

const createCharacter = async (req, res) => {
    try {
        const characters = {
            name: req.body.name,
            class: req.body.class,
            race: req.body.race,
        };
        const response = await db.getDatabase().collection('characters').insertOne(characters);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating a character', error: err.message });
    }
};

const updateCharacter = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid character id' });
    }
    try {
        const charactersId = new ObjectId(req.params.id);
        const character = {
            name: req.body.name,
            class: req.body.class,
            race: req.body.race,
        };
        const response = await db.getDatabase().collection('characters').replaceOne({ _id: charactersId }, character);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Character not found or no changes made' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating a character', error: err.message });
    }
};

const deleteCharacter = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid character ID" });
    }
    try {
        const charactersId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('characters').deleteOne({ _id: charactersId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Character deleted successfully' });
        } else {
            res.status(404).json({ message: 'Character not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting your character', error: err.message });
    }
};

module.exports = { getAllCharacter, getSingleCharacter, createCharacter, updateCharacter, deleteCharacter };
