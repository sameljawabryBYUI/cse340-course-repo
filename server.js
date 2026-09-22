import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

// 1. Import session and flash
import session from 'express-session';
import flash from './src/middleware/flash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Allow Express to receive and process common form data (POST requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Set up Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'my_super_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour
}));

// 3. Use flash message middleware
app.use(flash);

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); 
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Use the imported router to handle routes
app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler (500 errors)
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    res.status(status).render(`errors/${template}`, context);
});

// Start Server
const startServer = async () => {
    try {
        await testConnection();
        app.listen(port, () => {
            console.log(`Server running smoothly on port ${port}`);
            console.log(`Environment: ${NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();