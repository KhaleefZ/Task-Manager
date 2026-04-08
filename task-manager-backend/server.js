const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const morgan = require('morgan'); // Add this import
const mongoose = require('mongoose');


// ... (rest of your app.use routes)
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Log every incoming HTTP request to the terminal
app.use(morgan('dev')); 

// 2. Log every MongoDB query to the terminal
mongoose.set('debug', true); 


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'API with Auto-Incrementing Task Numbers (Task 1, Task 2...)',
        },
        servers: [{ url: 'http://localhost:5001' }],
        components: {
            schemas: {
                Task: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        taskNumber: { type: 'string', description: 'Auto-generated (e.g., Task 1)' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        completed: { type: 'boolean' }
                    }
                }
            }
        },
        paths: {
            '/api/tasks': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Get all tasks',
                    responses: { 200: { description: 'Success' } }
                },
                post: {
                    tags: ['Tasks'],
                    summary: 'Create a new task',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, description: { type: 'string' } } } } }
                    },
                    responses: { 201: { description: 'Created' } }
                }
            },
            '/api/tasks/{id}': {
                put: {
                    tags: ['Tasks'],
                    summary: 'Update task by number',
                    parameters: [{ name: 'id', in: 'path', required: true, description: 'e.g., Task 1', schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, completed: { type: 'boolean' } } } } }
                    },
                    responses: { 200: { description: 'Updated' } }
                },
                delete: {
                    tags: ['Tasks'],
                    summary: 'Delete task by number',
                    parameters: [{ name: 'id', in: 'path', required: true, description: 'e.g., Task 1', schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' } }
                }
            }
        }
    },
    apis: []
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));