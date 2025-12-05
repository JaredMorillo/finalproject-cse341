const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { Characters } = require("../models/index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Characters.deleteMany();
});

describe("Characters Model", () => {
  it("should create a character", async () => {
    const character = await Characters.create({
      name: "Hero",
      class: "Warrior",
      race: "Human",
    });

    expect(character.name).toBe("Hero");
    expect(character.class).toBe("Warrior");
    expect(character.race).toBe("Human");
  });

  it("should update a character", async () => {
    const character = await Characters.create({
      name: "Villain",
      class: "Mage",
    });

    character.class = "Dark Mage";
    await character.save();

    const updated = await Characters.findById(character._id);
    expect(updated.class).toBe("Dark Mage");
  });

  it("should delete a character", async () => {
    const character = await Characters.create({
      name: "Sidekick",
      class: "Rogue",
    });

    await Characters.findByIdAndDelete(character._id);
    const deleted = await Characters.findById(character._id);
    expect(deleted).toBeNull();
  });
});
