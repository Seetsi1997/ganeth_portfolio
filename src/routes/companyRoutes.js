import { Router } from 'express';
import Company from '../models/CompanyWorked.js';

const router = Router();

// GET all companies - PUBLIC ACCESS
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find({ status: "approved" }).sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      error: 'Failed to fetch companies',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Middleware - ADMIN SECRET CHECK
const checkAdminSecret = (req, res, next) => {
  // Get secret from Authorization header instead of query params (more secure)
  const authHeader = req.headers.authorization;
  const receivedSecret = authHeader && authHeader.split(' ')[1]; // Format: "Bearer [secret]"
  const expectedSecret = process.env.ADMIN_SECRET;

  if (!receivedSecret || receivedSecret !== expectedSecret) {
    console.warn(`Admin access denied from IP: ${req.ip}`);
    return res.status(403).json({
      error: "Admin access denied",
      details: process.env.NODE_ENV === 'development' ? "Invalid or missing admin secret" : undefined
    });
  }
  next();
};

// POST /company - ADMIN ONLY
router.post('/', checkAdminSecret, async (req, res) => {
  try {
    const { companyName } = req.body;

    // Validate input
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        error: "Company name is required",
        details: "Field cannot be empty or just whitespace"
      });
    }

    if (companyName.length > 100) {
      return res.status(400).json({
        error: "Company name too long",
        details: "Max 100 characters allowed"
      });
    }

    const trimmedName = companyName.trim();

    // Check duplicates (case-insensitive)
    const existingCompany = await Company.findOne({
      companyName: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (existingCompany) {
      return res.status(409).json({
        error: "Company already exists",
        existingId: existingCompany._id
      });
    }

    // Save to DB
    const newCompany = new Company({
      companyName: trimmedName,
      status: "approved",
      addedBy: req.ip,
    });

    const savedCompany = await newCompany.save();
    
    console.log(`New company added by admin: ${trimmedName}`);
    res.status(201).json(savedCompany);

  } catch (error) {
    console.error("Company creation error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message
      });
    }
    
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH /:id/approve - ADMIN ONLY
router.patch('/:id/approve', checkAdminSecret, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    console.log(`Company approved by admin: ${company.companyName}`);
    res.json(company);
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ 
      error: 'Failed to approve company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;