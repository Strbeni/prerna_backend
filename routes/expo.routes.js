import express from 'express';
import { registerExpo } from '../controllers/expo.controller.js';

const expoRouter = express.Router();
expoRouter.post('/register', registerExpo);

export default expoRouter;
