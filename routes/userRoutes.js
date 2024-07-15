// routes/userRoutes.js
import express from 'express';
import {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    authenticateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/user/create', createUserController);
router.get('/users', getAllUsersController);
router.get('/user/:id', getUserByIdController);
router.patch('/user/edit/:id', updateUserController);
router.delete('/user/delete/:id', deleteUserController);
router.post('/user/login', authenticateUser);

export default router;
