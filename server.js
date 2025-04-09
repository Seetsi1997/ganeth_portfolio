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

// Load environment variables
dotenv.config();

// Verify MongoDB URI
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined");
  process.exit(1);
}

const app = express();

// Middleware setup
app.use(express.json());

// 1. CORS Configuration
// Updated CORS and Host configuration
const corsOptions = {
  origin: 'https://seetsi1997.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  preflightContinue: false, // Important for Render
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


// 2. Host Validation Middleware
// Simplified host validation
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && 
      req.headers.host !== 'ganeth-portfolio.onrender.com') {
    return res.status(403).json({ 
      status: 'error',
      message: 'Invalid host',
      expected: 'ganeth-portfolio.onrender.com',
      received: req.headers.host
    });
  }
  next();
});

// 3. Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// 4. Routes
app.use('/educations', educationRoutes);
app.use('/testimonials', testimonialsRoutes);
app.use("/projects", projectsRoutes);
app.use('/workhistories', workHistoryRoutes);
app.use('/certificates', certificatesRoutes);
app.use('/companies', companyRoutes);
app.use('/works', workRoutes);
app.use('/services', servicesRoutes);
app.use('/portfolios', portfoliosRoutes)

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 6. Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: ${corsOptions.origin.join(', ')}`);
  });
});