import * as userModel from "../models/userModel.js";
import sql from "../config/db.js";

export const createUserController = async (req, res) => {
  const { name, email, address, password } = req.body;
  // console.log(req.body);
  try {
    const newUser = await userModel.createUser(name, email, address, password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.gelAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { name, address, password } = req.body;

  try {
    const existuser = await sql`SELECT * FROM Users WHERE UserId = ${id}`;
    if (existuser.length === 1) {
      if ((name, address, password)) {
        const updatedUser = await userModel.updateUser(
          id,
          name,
          address,
          password
        );
        return res.json({ msg: "successfully updated", updatedUser });
      } else {
        return res.json("all field value not provided");
      }
    }
    return res.status(404).json({ msg: "User not found" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userModel.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

export const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  const user = await sql`SELECT * FROM Users WHERE email = ${email}`;

  if (user.length === 1) {
    // Compare the provided password with the stored hashed password
    const storedHashedPassword = user[0].password;
    // Use the crypt function to hash the provided password for comparison
    const isValid =
      await sql`SELECT crypt(${password}, ${storedHashedPassword}) = ${storedHashedPassword} AS is_valid`;
    console.log(isValid[0].is_valid);

    if (isValid[0].is_valid) {
      return res.json("You are login Successfully"); // Authentication successful
    } else {
      throw new Error("Invalid password");
    }
  } else {
    return res.json("User not found");
  }
};
