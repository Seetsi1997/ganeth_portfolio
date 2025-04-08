import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import certificatesRoutes from './src/routes/certificatesRoutes.js';
import companyRoutes from './src/routes/companyRoutes.js';
import educationRoutes from './src/routes/educationRoutes.js';
import portfoliosRoutes from './src/routes/portfolioRoutes.js';
import projectsRoutes from './src/routes/projectsRoutes.js';
import servicesRoutes from './src/routes/serviceRoutes.js';
import testimonialsRoutes from './src/routes/testimonialsRoutes.js';
import workHistoryRoutes from './src/routes/workHistoryRoutes.js';
import workRoutes from './src/routes/workRoutes.js';

// Load environment variables first
dotenv.config();

console.log("MongoDB URI:", process.env.MONGO_URI);

// Verify MongoDB URI is set
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Enable CORS
//app.use(cors());
const cors = require('cors');
app.use(cors({
  origin: 'https://seetsi1997.github.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Connection timeout middleware
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    console.error(`Timeout for ${req.method} ${req.url}`);
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
});

// Improved MongoDB connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000
    });
    console.log(`MongoDB connected successfully` );
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Connect to database before starting server
connectDB();

// Routes
app.use('/educations', educationRoutes);
app.use('/testimonials', testimonialsRoutes);
app.use("/projects", projectsRoutes);
app.use('/workhistories', workHistoryRoutes);
app.use('/certificates', certificatesRoutes);
app.use('/companies', companyRoutes);
app.use('/works', workRoutes);
app.use('/services', servicesRoutes);
app.use('/portfolios', portfoliosRoutes)

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));