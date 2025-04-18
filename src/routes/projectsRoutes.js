import { Router } from 'express';
import Project from '../models/Project.js';
const router = Router();

// Fetch projects
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find({});
        if (!projects.length) {
            return res.status(404).json({ message: "No projects found" });

        }
        // It's okay to return an empty array - that's a valid response
        console.log(`Fetched ${projects.length} projects:`, projects);
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
});

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

// POST a new projects you did
router.post('/', checkAdminSecret, async (req, res) => {
    // Security: Remove detailed logging of secrets in production
    if (process.env.NODE_ENV === 'development') {
        console.log("Request body received:", req.body);
    }

    try {
        const { projectName, createdAt } = req.body;

        // Enhanced validation
        if (!projectName?.trim()) {
            return res.status(400).json({
                error: "Project name is required",
                details: "Field cannot be empty"
            });
        }

        const trimmedName = projectName.trim();
        
        if (trimmedName.length > 150) {
            return res.status(400).json({
                error: "Project name too long",
                details: "Max 150 characters allowed"
            });
        }

        // Case-insensitive duplicate check with better regex
        const existingProject = await Project.findOne({
            projectName: { 
                $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') 
            }
        });

        if (existingProject) {
            return res.status(409).json({
                error: "Project already exists",
                existingId: existingProject._id
            });
        }

        // Secure defaults - don't trust client input
        const newProject = new Project({
            projectName: trimmedName,
            status: "approved", 
            createdAt: new Date(createdAt || Date.now()),
            addedBy: req.ip,
        });

        const savedProject = await newProject.save();

        // Security: Don't log full project details
        console.log(`New project added by ${req.ip.substring(0, 7)}...`);

        res.status(201).json({
            id: savedProject._id,
            projectName: savedProject.projectName,
            status: savedProject.status,
            createdAt: savedProject.createdAt
        });

    } catch (error) {
        console.error('Project creation error:', error.message); // Limited error logging
        
        const response = {
            error: "Server error"
        };

        if (process.env.NODE_ENV === 'development') {
            response.details = error.message;
            if (error.name === 'ValidationError') {
                response.validation = error.errors;
            }
        }

        const statusCode = error.name === 'ValidationError' ? 400 : 500;
        res.status(statusCode).json(response);
    }
});


// PATCH UPDATE EXISTING project
// In your backend routes file (e.g., project.js)
router.patch('/:id/approve', checkAdminSecret, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`Project approved by admin: ${project.projectName}`);
    res.json(project);
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ 
      error: 'Failed to approve company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;