import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fashion Shop API',
            version: '1.0.0',
            description: 'API Documentation for Fashion Shop Service',
        },
        servers: [
            { url: 'http://localhost:5000' },
            { url: 'https://fashion-shop-service-production.up.railway.app' }
        ]
    },
    apis: ['src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
