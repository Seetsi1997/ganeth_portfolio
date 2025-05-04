import express from 'express';
import Educations from '../models/education-models/Education.js';

const router = express.Router();

// Improved calculation function
const calculateModuleStats = (modules, institutionType) => {
    if (!modules || modules.length === 0) {
        return {
            highest: 'N/A (N/A%)',
            lowest: 'N/A (N/A%)',
            failMessage: 'No subjects or modules found.'
        };
    }

    let highest = { percent: -Infinity, name: 'N/A' };
    let lowest = { percent: Infinity, name: 'N/A' };
    let fails = [];

    modules.forEach(module => {
        // Check if module failed
        const isFailed = (institutionType === 'highSchool' && module.percent < 30) ||
            (institutionType === 'university' && module.percent < 50) ||
            (institutionType === 'certificates' && module.percent < 700) ||
            (institutionType === 'learnership' && module.percent < 70);

        if (isFailed) {
            fails.push(`${module.name} (${module.percent}%)`);
        }

        // Check highest
        if (module.percent > highest.percent) {
            highest = { percent: module.percent, name: module.name };
        }

        // Check lowest
        if (module.percent < lowest.percent) {
            lowest = { percent: module.percent, name: module.name };
        }
    });

    return {
        highest: `${highest.name} (${highest.percent}%)`,
        lowest: `${lowest.name} (${lowest.percent}%)`,
        failMessage: fails.length > 0
            ? `Failed: ${fails.join(', ')}`
            : 'No failed modules'
    };
};

// GET all Education records(High School, Universities, Certificates and Learnership) (READ operation)
router.get('/', async (req, res) => {
    try {
        const education = await Educations.find()
            .sort({ startDate: 1 })
            .lean()
            .maxTimeMS(5000)
            .exec();

        if (!education.length) {
            return res.status(404).json({
                success: false,
                message: 'No education records found'
            });
        }

        const enrichedData = education.map(educ => {
            const startDate = educ.startDate ? new Date(educ.startDate) : null;
            const endDate = educ.endDate && educ.endDate !== "" ? new Date(educ.endDate) : null;  // ✅ Check for empty string

            let calendar = 'N/A';
            if (startDate) {
                const startYear = startDate.getFullYear();
                const endYear = endDate ? endDate.getFullYear() : 'Present';  // Will show "Present" if endDate is "" or null
                calendar = `${startYear} - ${endYear}`;
            }

            return {
                ...educ,
                id: educ._id,
                startDate: startDate ? startDate.toISOString().split('T')[0] : null,
                endDate: endDate ? endDate.toISOString().split('T')[0] : 'Present',  // Frontend will see "Present"
                ...calculateModuleStats(educ.modules, educ.institutionType),
                calendar: calendar  // Will now show "2025 - Present"
            };
        });

        console.log(`Fetched ${enrichedData.length} education records`, enrichedData);

        res.json({ success: true, data: enrichedData });

    } catch (err) {
        console.error('Education route error:', err);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: err.message
        });
    }
});

export default router;