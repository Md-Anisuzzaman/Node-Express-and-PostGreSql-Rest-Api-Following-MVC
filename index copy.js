import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import postgres from "postgres";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: "require",
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

// Function to create Users table if it doesn't exist
const createUsersTable = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        UserID SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        age VARCHAR(50) NOT NULL,
        city VARCHAR(50), -- Make sure to define 'city' if used
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`${sql.unsafe(createTableQuery)}`; // Use raw to execute DDL
};

// Call to create the Users table when the server starts
const init = async () => {
    await createUsersTable();
};

app.post("/api/user/create", async (req, res) => {
    const { name, age, city } = req.body;

    try {
        const existuser = await sql`SELECT * FROM Users WHERE name = ${name}`;
        console.log("is exist?", existuser);
        if (existuser.length > 0) {
            res.json("user aleady exists")
        }
        else {
            const newUser = await sql`
        INSERT INTO Users (name, age, city)
        VALUES (${name}, ${age}, ${city})
        RETURNING *
      `;
            res.json(newUser);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/api/alluser", async (req, res) => {
    try {
        const allusers = await sql`Select * from Users`
        console.log(allusers)
        res.json(allusers)
    } catch (error) {
        res.json(error)
    }
});
app.get("/api/user/:id", async (req, res) => {
    const id = req.params.id
    console.log(req.params);
    try {
        const isExist = await sql`select * from users where userid = ${id}`
        if (isExist.length > 0) {
            const user = await sql`Select * from Users where userid = ${id}`
            res.json(user)
        }
        else {
            res.json("user not find")

        }

    } catch (error) {
        res.json(error)
    }
});

app.get('/info', async (req, res) => {
    const { id} = req.query; // Extract the id from query parameters
    console.log(req.query);

    try {
        const user = await sql`SELECT * FROM Users WHERE UserID = ${id}`;
        
        if (user.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user[0]); // Return the first user found
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.put("/api/user/edit/:id", async (req, res) => {

    const { id } = req.params;
    const { name } = req.body
    try {
        // const isExist = await sql`select * from users where userid = ${id}`
        const updateUser = await sql`UPDATE Users SET name = ${name} WHERE UserId = ${id}  RETURNING *`
        console.log(updateUser);
        if (updateUser.length === 0) {
            res.json("user not find")
        }
        else {
            res.json({ msg: "user updated successfully", updateUser })
        }
    } catch (error) {
        res.json(error)
    }
})
app.delete("/api/user/delete/:id", async (req, res) => {

    const id = req.params.id;
    try {
        const isExist = await sql`select * from users where userid = ${id}`
        if (isExist.length > 0) {
            const deleteUser = await sql`delete from users where userid = ${id}`
            res.json({ msg: "user deleted successfully", deleteUser })
        }
        else {
            res.json("User not exist to delete")
        }
    } catch (error) {
        res.json(error)
    }
})

// Initialize and start the server
init()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`App running on port ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.error("Error initializing the database:", err.message);
    });
