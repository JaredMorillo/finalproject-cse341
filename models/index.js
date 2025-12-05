const mongoose = require("mongoose");

// Schema de masters
const mastersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  level: { type: Number },
  email: { type: String, required: true },
});

const Master = mongoose.model("masters", mastersSchema);

// Schema de stories
const storiesSchema = new mongoose.Schema({
  title: { type: String },
  genre: { type: String },
  description: { type: String },
});

const Stories = mongoose.model("stories", storiesSchema);

// Schema de items
const itemsSchema = new mongoose.Schema({
  item: { type: String },
  class: { type: Number },
  advantage: { type: String },
});

const Items = mongoose.model("items", itemsSchema);

// Schema de characters
const charactersSchema = new mongoose.Schema({
  name: { type: String },
  class: { type: String },
  race: { type: String },
});

const Characters = mongoose.model("characters", charactersSchema);

module.exports = { Master, Stories, Items, Characters };
