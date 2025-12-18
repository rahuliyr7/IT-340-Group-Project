import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'; // Adjust paths

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB error:', err));

app.use('/api/auth', authRoutes);
// Add other routes (product, payment, message)

app.listen(3000, () => console.log('Server on port 3000'));
