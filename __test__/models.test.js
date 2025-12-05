const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Master, Stories, Items, Characters } = require('../models/index');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); // ⚡ Mongoose 7+ ya no necesita opciones
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  }, 10000); // ⚡ timeout de 10s para afterAll


beforeEach(async () => {
  await Master.deleteMany({});
  await Stories.deleteMany({});
  await Items.deleteMany({});
  await Characters.deleteMany({});
});

describe('Master Model', () => {
  it('should create a master', async () => {
    const masterData = { name: 'John Doe', username: 'johndoe', level: 5, email: 'john@example.com' };
    const master = new Master(masterData);
    const savedMaster = await master.save();
    expect(savedMaster._id).toBeDefined();
    expect(savedMaster.name).toBe('John Doe');
  });

  it('should throw an error if required fields are missing', async () => {
    const master = new Master({ name: 'Jane Doe', level: 3 });
    await expect(master.save()).rejects.toThrow();
  });

  it('should update a master', async () => {
    const master = new Master({ name: 'Alice', username: 'alice123', level: 10, email: 'alice@example.com' });
    const savedMaster = await master.save();
    savedMaster.name = 'Alice Updated';
    const updatedMaster = await savedMaster.save();
    expect(updatedMaster.name).toBe('Alice Updated');
  });

  it('should delete a master', async () => {
    const master = new Master({ name: 'Bob', username: 'bob123', level: 8, email: 'bob@example.com' });
    const savedMaster = await master.save();
    await Master.findByIdAndDelete(savedMaster._id);
    const foundMaster = await Master.findById(savedMaster._id);
    expect(foundMaster).toBeNull();
  });
});

describe('Stories Model', () => {
  it('should create a story', async () => {
    const story = new Stories({ title: 'Epic Tale', genre: 'Fantasy', description: 'A story about heroes.' });
    const savedStory = await story.save();
    expect(savedStory._id).toBeDefined();
    expect(savedStory.title).toBe('Epic Tale');
  });

  it('should update a story', async () => {
    const story = new Stories({ title: 'Old Title' });
    const savedStory = await story.save();
    savedStory.title = 'New Title';
    const updatedStory = await savedStory.save();
    expect(updatedStory.title).toBe('New Title');
  });

  it('should delete a story', async () => {
    const story = new Stories({ title: 'Temporary Story' });
    const savedStory = await story.save();
    await Stories.findByIdAndDelete(savedStory._id);
    const foundStory = await Stories.findById(savedStory._id);
    expect(foundStory).toBeNull();
  });
});

describe('Items Model', () => {
  it('should create an item', async () => {
    const item = new Items({ item: 'Sword', class: 1, advantage: 'Sharp' });
    const savedItem = await item.save();
    expect(savedItem._id).toBeDefined();
    expect(savedItem.item).toBe('Sword');
  });

  it('should update an item', async () => {
    const item = new Items({ item: 'Shield', class: 2 });
    const savedItem = await item.save();
    savedItem.advantage = 'Heavy';
    const updatedItem = await savedItem.save();
    expect(updatedItem.advantage).toBe('Heavy');
  });

  it('should delete an item', async () => {
    const item = new Items({ item: 'Helmet', class: 1 });
    const savedItem = await item.save();
    await Items.findByIdAndDelete(savedItem._id);
    const foundItem = await Items.findById(savedItem._id);
    expect(foundItem).toBeNull();
  });
});

describe('Characters Model', () => {
  it('should create a character', async () => {
    const char = new Characters({ name: 'Elf Warrior', class: 'Warrior', race: 'Elf' });
    const savedChar = await char.save();
    expect(savedChar._id).toBeDefined();
    expect(savedChar.name).toBe('Elf Warrior');
  });

  it('should update a character', async () => {
    const char = new Characters({ name: 'Orc', class: 'Berserker', race: 'Orc' });
    const savedChar = await char.save();
    savedChar.class = 'Shaman';
    const updatedChar = await savedChar.save();
    expect(updatedChar.class).toBe('Shaman');
  });

  it('should delete a character', async () => {
    const char = new Characters({ name: 'Goblin', class: 'Rogue', race: 'Goblin' });
    const savedChar = await char.save();
    await Characters.findByIdAndDelete(savedChar._id);
    const foundChar = await Characters.findById(savedChar._id);
    expect(foundChar).toBeNull();
  });
});
