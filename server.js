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
const mongoURI = process.env.MONGO_URI;
const adminSecret = process.env.ADMIN_SECRET;

// Verify MongoDB URI
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined");
  process.exit(1);
}

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Debugging: Log incoming origins
app.use((req, res, next) => {
  console.log(`Incoming origin: ${req.headers.origin}`);
  next();
});

// --- UPDATED: Simplified CORS Configuration ---
const allowedOrigins = [
  'https://seetsi1997.github.io',
  'https://seetsi1997.github.io/ganeth_portfolio',
  'http://localhost:3000'
];

console.log(`Allowed CORS origin(s): ${allowedOrigins.join(', ')}`);

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

// --- OPTIONAL: Temporarily disabled host validation (for testing) ---
// Uncomment this only when you need strict host checking in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers.host !== 'ganeth-portfolio.onrender.com'
  ) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid host',
      expected: 'ganeth-portfolio.onrender.com',
      received: req.headers.host
    });
  }
  next();
});


// --- UPDATED: Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// --- ROUTES GO HERE ---
// Example:
// app.use('/educations', educationRoutes);
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

// Global Error Handling Middleware





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