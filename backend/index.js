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
import adminRoute from './routes/User/admin.js';
import lectuerRoute from './routes/User/lecturer.js';
import studentRoute from './routes/User/student.js';
import classRoute from './routes/School/class.js';
import facultyRoute from './routes/School/faculty.js';
import programRoute from './routes/School/program.js';
import subjectRoute from './routes/School/subject.js';

// Use routes
app.use('/admin', adminRoute);
app.use('/lecturer', lectuerRoute);
app.use('/student', studentRoute);
app.use('/class', classRoute);
app.use('/faculty', facultyRoute);
app.use('/program', programRoute);
app.use('/subject', subjectRoute);


const server = http.createServer(app);
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})