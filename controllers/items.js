const db = require("../database/db");
const { ObjectId } = require('mongodb');

const getAllItems = async (req, res) => {
    try {
        const lists = await db.getDatabase().collection('items').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding your item', error: err.message });
    }
};

const getSingleItems = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid item id' });
    }
    try {
        const itemsId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('items').findOne({ _id: itemsId });
        if (!result) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error finding item', error: err.message });
    }
};

const createItems = async (req, res) => {
    try {
        const items = {
            item: req.body.item,
            class: req.body.class,
            advantage: req.body.advantage,
        };
        const response = await db.getDatabase().collection('items').insertOne(items);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating a item', error: err.message });
    }
};

const updateItems = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid item id' });
    }
    try {
        const itemsId = new ObjectId(req.params.id);
        const items = {
            item: req.body.item,
            class: req.body.class,
            advantage: req.body.advantage,
        };
        const response = await db.getDatabase().collection('items').replaceOne({ _id: itemsId }, items);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Item not found or no changes made' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating a Item', error: err.message });
    }
};

const deleteItems = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid item ID" });
    }
    try {
        const itemsId = new ObjectId(req.params.id);
        const result = await db.getDatabase().collection('items').deleteOne({ _id: itemsId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting item', error: err.message });
    }
};

module.exports = { getAllItems, getSingleItems, createItems, updateItems, deleteItems };
