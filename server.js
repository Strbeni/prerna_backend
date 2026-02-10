import express from 'express';
import 'dotenv/config';
import connectDB from './config/db.js';
import cors from 'cors';
import hackathonRouter from './routes/hackathon.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

app.use(cors(
    {
        origin: '*',
        methods: ['GET','POST','PUT','DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type','Authorization'], 
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/hackathon', hackathonRouter);





