const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FlowForm API Documentation',
            version: '1.0.0',
            description: 'API documentation for FlowForm backend',
        },
    },
    // Path to the API docs
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
