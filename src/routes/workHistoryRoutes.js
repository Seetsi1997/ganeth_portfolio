import { Router } from "express";
import WorkHistories from "../models/WorkHistory.js";

const router = Router();

// GET all work histories
router.get("/", async (req, res) => {
    try {
        const workHistories = await WorkHistories.find({}).sort({ createdAt: -1 });
        if (!workHistories.length) {
               return res.status(404).json({ message: "No work history found" });
           }
           
        // It's okay to return an empty array - that's a valid response
        console.log(`Fetched  ${workHistories.length} work histories`, workHistories);
        res.json(workHistories);
    } catch (error) {
        console.error("Error fetching work histories:", error);
        res.status(500).json({ 
            error: 'Failed to fetch work histories', 
            details: error.message 
        });
    }
});

// It checks admin secrete 
const checkAdminSecret = (req, res, next) => {
  const receivedSecret = req.query.secret;
  const expectedSecret = process.env.ADMIN_SECRET;

  console.log(`Secret check: ${receivedSecret} vs ${expectedSecret}`);

  if (receivedSecret !== expectedSecret) {
      return res.status(403).json({
          error: "Admin access denied",
          details: `Invalid secret. Received: ${receivedSecret} | Expected: ${expectedSecret}`
      });
  }
  next();
};

// POST new work history
router.post('/',checkAdminSecret ,async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log("Received secret:", req.query.secret);
      console.log("Expected secret:", process.env.ADMIN_SECRET);
      
      if (!req.body.workHistory || typeof req.body.workHistory !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid input',
          details: 'work history must be a non-empty string' 
        });
      }
  
      const workHistories = new WorkHistories({
        workHistory: req.body.workHistory.trim()
      });
  
      const savedWork = await workHistories.save();
      console.log('Saved work history:', savedWork);
      
      res.status(201).json(savedWork);
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ 
        error: 'Server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
  

export default router;
