import { Router } from 'express';
import Certificates from '../models/Certificates.js';

const router = Router();

// GET all certificates
router.get("/", async (req, res) => {
    try {
        const certificates = await Certificates.find({}).sort({ createdAt: -1 });

        if (!certificates.length) {
         // It's okay to return empty array - that's a valid response
           
            return res.status(404).json({ message: "No certificates found" });
        }
        
       
        console.log(`Fetched ${certificates.length}  certificates`, certificates);
        res.json(certificates);
    } catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({ 
            error: 'Failed to fetch certificates', 
            details: error.message 
        });
    }
});

// Middleware
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

// POST new certificate
router.post('/', checkAdminSecret, async (req, res) => {
  console.log("Request body received:", req.body);
  try {
    const { certificateName } = req.body;

    // Remove secret logging in production
    if (process.env.NODE_ENV !== 'production') {
      console.log("Secret verification passed");
    }

    // Validation
    if (!certificateName || !certificateName.trim()) {
      return res.status(400).json({
        error: "Certificate name is required",
        details: "Field cannot be empty or just whitespace"
      });
    }
    
    const trimmedName = certificateName.trim();
    
    if (trimmedName.length > 100) {
      return res.status(400).json({
        error: "Certificate name too long",
        details: "Max 100 characters allowed"
      });
    }

    // Check duplicates
    const existingCertificate = await Certificates.findOne({
      certificateName: trimmedName  // Fixed field name
    });

    if (existingCertificate) {
      return res.status(409).json({
        error: "Certificate already exists"
      });
    }

    const certificate = new Certificates({
      certificateName: trimmedName,
      status: req.body.status || "approved", 
      addedBy: req.ip,
    });

    const savedCertificate = await certificate.save();

    console.log('Certificate created:', { id: savedCertificate._id, name: savedCertificate.certificateName });
    console.log(`New Certificate added by admin: ${trimmedName}`);
    
    res.status(201).json(savedCertificate);
  } catch (error) {
    console.error('Certificate creation / add error:', error);
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

// PATCH UPDATE EXISTING certificate
// In your backend routes file (e.g., certificates.js)
router.patch('/:id/approve', checkAdminSecret, async (req, res) => {
  try {
    const certificate = await Certificates.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' }); 
    }

    res.json(certificate);
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Failed to approve certificate' });
  }
});

export default router;