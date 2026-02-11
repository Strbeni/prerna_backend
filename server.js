import express from 'express';
import 'dotenv/config';
import connectDB from './config/db.js';
import cors from 'cors';
import hackathonRouter from './routes/hackathon.routes.js';
import startupRouter from './routes/startup.routes.js';
import expoRouter from './routes/expo.routes.js';
import qrcode_gen from './qrcode/qrcode_gen.js';

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
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/hackathon', hackathonRouter);
app.use('/api/startup', startupRouter);
app.use('/api/expo', expoRouter);
app.use('/api/qrcode', qrcode_gen);





