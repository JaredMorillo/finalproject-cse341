const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { Items } = require("../models/index");

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
  await Items.deleteMany();
});

describe("Items Model", () => {
  it("should create an item", async () => {
    const item = await Items.create({
      item: "Sword",
      class: 1,
      advantage: "Sharp blade",
    });

    expect(item.item).toBe("Sword");
    expect(item.class).toBe(1);
    expect(item.advantage).toBe("Sharp blade");
  });

  it("should update an item", async () => {
    const item = await Items.create({
      item: "Shield",
      class: 2,
    });

    item.advantage = "Very sturdy";
    await item.save();

    const updated = await Items.findById(item._id);
    expect(updated.advantage).toBe("Very sturdy");
  });

  it("should delete an item", async () => {
    const item = await Items.create({
      item: "Potion",
      class: 3,
      advantage: "Heals 50 HP",
    });

    await Items.findByIdAndDelete(item._id);
    const deleted = await Items.findById(item._id);
    expect(deleted).toBeNull();
  });
});
