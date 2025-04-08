import { Router } from 'express';
import Company from '../models/CompanyWorked.js';

const router = Router();

// GET all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find({ status: "approved" }).sort({ createdAt: -1 });

    console.log(`Fetched ${companies.length} companies names`, companies);
    res.status(200).json(companies); 

  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      error: 'Failed to fetch companies',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Middleware
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

// POST /company (admin-only)
router.post('/', checkAdminSecret, async (req, res) => {
  console.log("Request body received:", req.body);
  try {
    const { companyName } = req.body;
    console.log("Received secret:", req.query.secret);
    console.log("Expected secret:", process.env.ADMIN_SECRET);


    // Validation

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        error: "Company name is required",
        details: "Field cannot be empty or just whitespace"
      });
    }
    // ... rest of your logic

    if (companyName.length > 100) {
      return res.status(400).json({
        error: "Company name too long",
        details: "Max 100 characters allowed"
      });
    }

    // Check duplicates
    const existingCompany = await Company.findOne({
      companyName: companyName.trim()
    });

    if (existingCompany) {
      return res.status(409).json({
        error: "Company already exists"
      });
    }

    // Save to DB
    const newCompany = new Company({
      companyName: companyName.trim(),
      status: "approved" // Auto-approve admin-added entries
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);

  } catch (error) {
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

// PATCH UPDATE EXISTING Company I Worked
// In your backend routes file (e.g., CompanyWorked.js)
router.patch('/:id/approve', checkAdminSecret, async (req, res) => {
  try {
    const companies = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    );

    if (!companies) {
      return res.status(404).json({ error: 'Project not found' }); 
    }

    res.json(companies);
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Failed to approve project' });
  }
});

export default router;