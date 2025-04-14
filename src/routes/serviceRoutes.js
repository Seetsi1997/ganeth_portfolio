import express from 'express';
import Services from '../models/Service.js';

const router = express.Router()


router.get('/', async (req, res) => {
  try {
    const services = await Services.find().sort({ createdAt: -1 });
    
    // Logging for debugging (from your first version)
    console.log(`Fetched ${services.length} services`);
    
    // Improved response structure (from second version)
    res.status(200).json({ 
      success: true,
      data: services,
      count: services.length,
      message: services.length ? "Services found" : "No services available"
    });

  } catch (error) {
    // Combined error handling
    console.error("Database error:", error);
    res.status(500).json({ 
      success: false,
      error: "Unable to retrieve services",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


export default router;