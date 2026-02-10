import express from 'express';
import { registerStartup } from '../controllers/startup.controller.js';

const startupRouter = express.Router();
startupRouter.post('/register', registerStartup);

export default startupRouter;
