import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

// Renders the registration form view
export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Handles registration logic, hashing, and saving the user
export const processUserRegistrationForm = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        await createUser(name, email, passwordHash);
        
        res.redirect('/');
        
    } catch (error) {
        console.error("Error during registration:", error);
        
        // Check if the error is a PostgreSQL unique violation (duplicate email)
        if (error.code === '23505') {
            return res.status(400).send("An account with this email already exists. Please use a different email.");
        }
        
        res.status(500).send("An error occurred during registration.");
    }
};