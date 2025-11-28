const { use } = require("passport");
const db = require("../database/db");
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    try {
        const lists = await db.getDatabase().collection('masters').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching master', error: err.message });
    }
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid master id' });
    }
    try {
        const mastersId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('masters').findOne({ _id: mastersId });
        if (!result) return res.status(404).json({ message: 'Master not found.' });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding your master.', error: err.message });
    }
};

const createMasters = async (req, res) => {
    try {
        const masters = {
            name: req.body.name,
            username: req.body.username,
            level: req.body.level,
            email: req.body.email,
        };
        const response = await db.getDatabase().collection('masters').insertOne(masters);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating a new master.', error: err.message });
    }
};

const updateMasters = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid master id' });
    }
    try {
        const mastersId = new ObjectId(req.params.id);
        const masters = {
            name: req.body.name,
            username: req.body.username,
            level: req.body.level,
            email: req.body.email,
        };
        const response = await db.getDatabase().collection('masters').replaceOne({ _id: mastersId }, masters);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Master not found or no changes made' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating your master.', error: err.message });
    }
};

const deleteMasters = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid master ID" });
    }
    try {
        const mastersId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('masters').deleteOne({ _id: mastersId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Your master was deleted successfully' });
        } else {
            res.status(404).json({ message: 'Master not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting your master.', error: err.message });
    }
};

module.exports = { getAll, getSingle, createMasters, updateMasters, deleteMasters };
