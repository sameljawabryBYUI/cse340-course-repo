import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Static Middleware (Requirement: Serve the public folder)
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Routes (Requirement: Arrow functions)
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/organizations', (req, res) => {
    res.render('organizations', { title: 'Organizations' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Service Projects' });
});

app.get('/categories', (req, res) => {
    res.render('categories', { title: 'Categories' });
});

// Start Server (Requirement: Async/await and arrow functions)
const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server running smoothly on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();