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

// Verify MongoDB URI
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined");
  process.exit(1);
}

const app = express();

// Enhanced MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,  // Increased timeout
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      ssl: true,  // Explicitly enable SSL
      tlsAllowInvalidCertificates: false
    });
    
    console.log("✅ MongoDB connected");
    console.log("MONGO_URI:", process.env.MONGO_URI);

    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
    
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    
    // More specific error handling
    if (err.name === 'MongoNetworkError') {
      console.error('Network error - check your connection and IP whitelisting');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('Server selection error - check your MongoDB URI and cluster status');
    }
    
    process.exit(1);
  }
};

// Middleware to parse JSON
app.use(express.json());

// Serve static assets (e.g., images) from the 'assets' folder
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


// Debugging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Enhanced CORS Configuration
const allowedOrigins = [
  'https://seetsi1997.github.io',
  'https://seetsi1997.github.io/ganeth_portfolio',
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Add CORS headers manually for additional assurance
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

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


// Serve static files with base path for React Router
const staticPath = path.join(__dirname, 'build');
// Serve React frontend
const buildPath = path.join(__dirname, 'build');
/*app.use(express.static(buildPath));
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});*/

app.use('/ganeth_portfolio', express.static(staticPath));
app.get('/ganeth_portfolio/*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ message: 'Not found' });
    }
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS policy violation',
      allowedOrigins: allowedOrigins,
      yourOrigin: req.headers.origin || 'none'
    });
  }
  
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    console.log(`📁 Serving static files from: ${staticPath}`);
    console.log(`🔒 CORS strict mode: ${corsOptions.origin ? 'enabled' : 'disabled'}`);
  });
};

startServer().catch(err => {
  console.error("🔥 Failed to start server:", err);
  process.exit(1);
});