import express from 'express';
import Work from '../models/education-models/Work.js';

const router = express.Router();
// Improved calculation function for work experience
const calculateWorkStats = (skills, employmentType) => {
    if (!skills || skills.length === 0) {
        return {
            primarySkill: 'N/A',
            skillCount: 0,
            proficiencySummary: 'No skills listed'
        };
    }

    let primarySkill = { name: 'N/A', proficiency: 'N/A' };
    const proficiencyCount = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0
    };

    skills.forEach(skill => {
        // Track highest proficiency skill
        if (!primarySkill.proficiency ||
            skill.proficiency === 'expert' ||
            (skill.proficiency === 'advanced' && primarySkill.proficiency !== 'expert') ||
            (skill.proficiency === 'intermediate' && !['expert', 'advanced'].includes(primarySkill.proficiency))) {
            primarySkill = {
                name: skill.name,
                proficiency: skill.proficiency
            };
        }

        // Count proficiency levels
        if (skill.proficiency) {
            proficiencyCount[skill.proficiency]++;
        }
    });

    // Generate proficiency summary
    const proficiencySummary = Object.entries(proficiencyCount)
        .filter(([_, count]) => count > 0)
        .map(([level, count]) => `${count} ${level}`)
        .join(', ');

    return {
        primarySkill: `${primarySkill.name} (${primarySkill.proficiency})`,
        skillCount: skills.length,
        proficiencySummary: proficiencySummary || 'No proficiency data',
        employmentType: employmentType.charAt(0).toUpperCase() + employmentType.slice(1)
    };
};

// GET all work records
router.get('/', async (req, res) => {
    try {
        const docs = await Work.find()
            .sort({ startDate: -1 }) // Newest first
            .lean()
            .maxTimeMS(5000)
            .exec();

        if (!docs.length) {
            return res.status(404).json({
                success: false,
                message: 'No work records found'
            });
        }

        const enrichedData = docs.map(doc => {
            // Safely handle dates
            const startDate = doc.startDate ? new Date(doc.startDate) : null;
            const endDate = doc.currentlyWorking ? 'Present' :
                (doc.endDate ? new Date(doc.endDate) : null);

            // Calculate duration in months
            const duration = startDate ?
                Math.floor(((endDate === 'Present' ? new Date() : endDate) - startDate) /
                    (1000 * 60 * 60 * 24 * 30)) :
                null;

            return {
                ...doc,
                id: doc._id,
                // Format dates safely
                startDate: startDate ? startDate.toISOString().split('T')[0] : null,
                endDate: endDate === 'Present' ? endDate :
                    (endDate ? endDate.toISOString().split('T')[0] : null),
                // Add work statistics
                ...calculateWorkStats(doc.skills, doc.employmentType),
                // Format duration
                duration: duration ? `${duration} months` : 'N/A',
                // Format employment period
                employmentPeriod: startDate ?
                    `${startDate.getFullYear()} - ${endDate === 'Present' ? 'Present' : endDate.getFullYear()}` :
                    'N/A'
            };
        });

        console.log(`Fetched ${enrichedData.length} work records`, enrichedData);
        res.json({
            success: true,
            data: enrichedData,
            stats: {
                totalRecords: enrichedData.length,
                currentJobs: enrichedData.filter(d => d.endDate === 'Present').length,
                skillCount: enrichedData.reduce((sum, d) => sum + d.skillCount, 0)
            }
        });

    } catch (err) {
        console.error('Work route error:', err);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: err.message
        });
    }
});


export default router;