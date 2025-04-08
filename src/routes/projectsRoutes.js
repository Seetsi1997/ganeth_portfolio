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

// POST a new projects you did
router.post('/', checkAdminSecret, async (req, res) => {
    console.log("Request body received:", req.body);
    try {
        const { projectName } = req.body;
        console.log("Received secret:", req.query.secret);
        console.log("Expected secret:", process.env.ADMIN_SECRET);


        // Validation

        if (!projectName || !projectName.trim()) {
            return res.status(400).json({
                error: "Project name is required",
                details: "Field cannot be empty or just whitespace"
            });
        }
        // ... rest of your logic

        if (projectName.length > 150) {
            return res.status(400).json({
                error: "Project name too long",
                details: "Max 150 characters allowed"
            });
        }

        // Check duplicates
        const existingProject = await Project.findOne({
            projectNameName: projectName.trim()
        });

        if (existingProject) {
            return res.status(409).json({
                error: "Project already exists"
            });
        }

        // Save to DB
        const newProject = new Project({
            projectName: req.body.projectName,
            status: req.body.status || "approved",
            createdAt: req.body.createdAt || Date.now(),
        });

        const savedProjects = await newProject.save();
        console.log('Project created:',
            {
                id: savedProjects._id,
                name: savedProjects.projectName,
                createdAt: savedProjects.createdAt,
            });


        res.status(201).json(savedProjects);
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

        res.json(project);
    } catch (error) {
        console.error('Approval error:', error);
        res.status(500).json({ error: 'Failed to approve project' });
    }
});


export default router;