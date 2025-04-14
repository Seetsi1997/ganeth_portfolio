import express from 'express';
import Portfolios from '../models/Portfolio.js';

const router = express.Router();

// GET all projects (approved and pending)
router.get('/', async (req, res) => {
  try {
    // Remove status filter to get all projects
    const projects = await Portfolios.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch projects'
    });
  }
});

// GET approved projects only (for public view)
router.get('/approved', async (req, res) => {
  try {
    const projects = await Portfolios.find({ status: 'approved' });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch approved projects'
    });
  }
});

// PATCH approval endpoint (standardize status values)
router.patch('/:id/approve', async (req, res) => {
  try {
    const project = await Portfolios.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' }, // Changed to lowercase for consistency
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: project 
    });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during approval' 
    });
  }
});

export default router;