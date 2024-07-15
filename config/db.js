import postgres from 'postgres';
import 'dotenv/config';

// let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
// PGPASSWORD = decodeURIComponent(PGPASSWORD);

const sql = postgres({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: decodeURIComponent(process.env.PGPASSWORD),
    port: 5432,
    ssl: 'require',
});

// General function to create a table if it doesn't exist
export const createTableIfNotExists = async (createTableQuery) => {
    await sql.unsafe(createTableQuery);
};

// Specific table creation SQL
const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS Users (
        userID SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        address TEXT NOT NULL,
        password VARCHAR(100) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Initialize all tables
export const initDatabase = async () => {
    await createTableIfNotExists(createUsersTableSQL);
    // Add more table creation queries here as needed
};

export default sql;
