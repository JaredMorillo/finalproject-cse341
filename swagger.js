const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Dungeons Tales API',
    description: 'Final Project for CSE341',
  },
  host: 'localhost:5050',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);