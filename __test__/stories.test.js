const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { Stories } = require("../models/index");

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
  await Stories.deleteMany();
});

describe("Stories Model", () => {
  it("should create a story", async () => {
    const story = await Stories.create({
      title: "The Beginning",
      genre: "Fantasy",
      description: "Once upon a time...",
    });

    expect(story.title).toBe("The Beginning");
    expect(story.genre).toBe("Fantasy");
    expect(story.description).toBe("Once upon a time...");
  });

  it("should update a story", async () => {
    const story = await Stories.create({
      title: "Adventure",
      genre: "Action",
    });

    story.genre = "Epic Action";
    await story.save();

    const updated = await Stories.findById(story._id);
    expect(updated.genre).toBe("Epic Action");
  });

  it("should delete a story", async () => {
    const story = await Stories.create({
      title: "Finale",
      description: "The end...",
    });

    await Stories.findByIdAndDelete(story._id);
    const deleted = await Stories.findById(story._id);
    expect(deleted).toBeNull();
  });
});
