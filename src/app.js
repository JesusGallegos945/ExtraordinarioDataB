import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv/config';
import connectDB from './connection/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import toursRoutes from './routes/tours.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import customersRoutes from './routes/customers.routes.js';

connectDB(); 
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app'] 
    : ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));

app.use('/api/auth', authRoutes);
app.use('/api', toursRoutes);
app.use('/api', reservationsRoutes);
app.use('/api', customersRoutes);

export default app;