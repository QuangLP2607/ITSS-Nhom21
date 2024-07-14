import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.use(cors());        // test

app.use(cookieParser());
app.use(express.json());

// Routes declaration
import userRoute from './routes/user.js';
import adminRoute from './routes/admin.js';

// Use routes
app.use('/users', userRoute);
app.use('/admin', adminRoute);



const server = http.createServer(app);
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})