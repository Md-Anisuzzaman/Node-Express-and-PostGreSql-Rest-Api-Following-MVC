// server.js
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import { initDatabase } from './config/db.js'; // Import the function
import 'dotenv/config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRoutes);

const PORT = process.env.PORT || 7000;

const init = async () => {
    try {
        await initDatabase(); // Ensure the Users table exists
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing the database:', error.message);
        process.exit(1); // Exit if table creation fails
    }
};

init(); // Call the init function to start the server and create the table
