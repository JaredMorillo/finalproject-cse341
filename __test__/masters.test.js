const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Master } = require('../models/index');

let mongoServer;
jest.setTimeout(30000); // aumenta timeout global si es necesario

beforeAll(async () => {
  // Creamos un servidor MongoDB en memoria
   mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); // sin useNewUrlParser ni useUnifiedTopology
});

afterAll(async () => {
  // Cerramos la conexión y detenemos el servidor de memoria
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Limpiamos la colección antes de cada test
  await Master.deleteMany({});
});

describe('Master Model', () => {
  it('should create a master', async () => {
    const masterData = {
      name: 'John Doe',
      username: 'johndoe',
      level: 5,
      email: 'john@example.com',
    };

    const master = new Master(masterData);
    const savedMaster = await master.save();

    expect(savedMaster._id).toBeDefined();
    expect(savedMaster.name).toBe('John Doe');
    expect(savedMaster.username).toBe('johndoe');
    expect(savedMaster.level).toBe(5);
    expect(savedMaster.email).toBe('john@example.com');
  });

  it('should throw an error if required fields are missing', async () => {
    const masterData = {
      name: 'Jane Doe',
      level: 3,
    };

    const master = new Master(masterData);

    // Debe fallar porque 'username' y 'email' son obligatorios
    await expect(master.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should update a master', async () => {
    const masterData = {
      name: 'Alice',
      username: 'alice123',
      level: 10,
      email: 'alice@example.com',
    };

    const master = new Master(masterData);
    const savedMaster = await master.save();

    savedMaster.name = 'Alice Updated';
    const updatedMaster = await savedMaster.save();

    expect(updatedMaster.name).toBe('Alice Updated');
  });

  it('should delete a master', async () => {
    const masterData = {
      name: 'Bob',
      username: 'bob123',
      level: 8,
      email: 'bob@example.com',
    };

    const master = new Master(masterData);
    const savedMaster = await master.save();

    await Master.findByIdAndDelete(savedMaster._id);

    const foundMaster = await Master.findById(savedMaster._id);
    expect(foundMaster).toBeNull();
  });
});
