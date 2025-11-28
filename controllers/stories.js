const db = require("../database/db");
const { ObjectId } = require('mongodb');

const getAllStories = async (req, res) => {
    try {
        const lists = await db.getDatabase().collection('stories').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding your story', error: err.message });
    }
};

const getSingleStories = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid story id' });
    }
    try {
        const storiesId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('stories').findOne({ _id: storiesId });
        if (!result) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding story', error: err.message });
    }
};

const createStories = async (req, res) => {
    try {
        const stories = {
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.description,
        };
        const response = await db.getDatabase().collection('stories').insertOne(stories);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating a story', error: err.message });
    }
};

const updateStories = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid story id' });
    }
    try {
        const storiesId = new ObjectId(req.params.id);
        const stories = {
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.description,
        };
        const response = await db.getDatabase().collection('stories').replaceOne({ _id: storiesId }, stories);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Story not found or no changes made' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating a story', error: err.message });
    }
};

const deleteStories = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid story ID" });
    }
    try {
        const storiesId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('stories').deleteOne({ _id: storiesId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Story deleted successfully' });
        } else {
            res.status(404).json({ message: 'Story not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting story', error: err.message });
    }
};

module.exports = { getAllStories, getSingleStories, createStories, updateStories, deleteStories };
