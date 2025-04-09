import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

// Import routes
import certificatesRoutes from './src/routes/certificatesRoutes.js';
import companyRoutes from './src/routes/companyRoutes.js';
import educationRoutes from './src/routes/educationRoutes.js';
import portfoliosRoutes from './src/routes/portfolioRoutes.js';
import projectsRoutes from './src/routes/projectsRoutes.js';
import servicesRoutes from './src/routes/serviceRoutes.js';
import testimonialsRoutes from './src/routes/testimonialsRoutes.js';
import workHistoryRoutes from './src/routes/workHistoryRoutes.js';
import workRoutes from './src/routes/workRoutes.js';


// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// CORS Configuration
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

// Optional host validation
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

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Routes
app.use('/educations', educationRoutes);
app.use('/testimonials', testimonialsRoutes);
app.use("/projects", projectsRoutes);
app.use('/workhistories', workHistoryRoutes);
app.use('/certificates', certificatesRoutes);
app.use('/companies', companyRoutes);
app.use('/works', workRoutes);
app.use('/services', servicesRoutes);
app.use('/portfolios', portfoliosRoutes);

// Serve static files from the React app
const staticPath = path.join(__dirname, 'build');
app.use(express.static(staticPath));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ message: 'Page not found' });
    }
  });
});

// Global Error Handling Middleware
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