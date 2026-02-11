import express from 'express';
import { registerTeam } from '../controllers/hackathon.controller.js';

const hackathonRouter = express.Router();
hackathonRouter.post('/registerTeam', registerTeam);

export default hackathonRouter;
