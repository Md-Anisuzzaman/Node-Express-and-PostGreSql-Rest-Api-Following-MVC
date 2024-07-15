import postgres from "postgres";
import sql from "../config/db.js";
await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

export const createUser = async (name, email, address, password) => {
    const newUser = await sql`
    INSERT INTO Users (name,email,address,password)
    VALUES (${name},${email},${address},crypt(${password},gen_salt('bf'))) RETURNING *
    `;
    return newUser[0];
};

export const gelAllUsers = async () => {
    return await sql`SELECT * FROM Users`;
};
export const getUserById = async (id) => {
    const user = await sql`SELECT * FROM Users WHERE UserID = ${id}`;
    return user[0];
};
export const updateUser = async (id, name, address, password) => {
    const updatedUser = await sql`
        UPDATE Users 
        SET name = ${name}, address = ${address}, password = crypt(${password},gen_salt('bf'))
        WHERE UserID = ${id} 
        RETURNING *
    `;
    return updatedUser[0];
};

export const deleteUser = async (id) => {
    const deletedUser = await sql`
        DELETE FROM Users 
        WHERE UserID = ${id} 
        RETURNING *
    `;
    return deletedUser[0];
};

