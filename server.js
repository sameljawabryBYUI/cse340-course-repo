import 'dotenv/config';
import express from 'express';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

const app = express();
const port = process.env.PORT || 3000;

// Static Middleware (Requirement: Serve the public folder)
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Routes with database calls
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Service Projects', projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Server Error');
    }
});

// Start Server (Requirement: Async/await and arrow functions)
const startServer = async () => {
    try {
        await testConnection();
        app.listen(port, () => {
            console.log(`Server running smoothly on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();