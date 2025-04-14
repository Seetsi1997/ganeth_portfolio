import { Router } from "express";
import Testimonial from "../models/Testimonials.js";
const router = Router();

// Fetch testimonials sorted by rating (5/5 first, 1/5 last)
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ 
      rating: -1,        
      createdAt: -1       
    });

    if (!testimonials.length) {
      return res
        .status(404)
        .json({ message: "No testimonials found, please try again" });
    }

    console.log(`Fetched ${testimonials.length} testimonials`);
    res.json(testimonials);
  } catch (error) {
    console.error("Unable to retrieve testimonials:", error);
    res.status(500).json({
      error: "Unable to retrieve testimonial details",
      details: error.message,
    });
  }
});

// POST a new testimonial (unchanged)
router.post("/", async (req, res) => {
  try {
    const newTestimonial = new Testimonial({
      userName: req.body.userName,
      review: req.body.review,
      career: req.body.career,
      rating: req.body.rating,
      createdAt: req.body.createdAt,
    });

    const savedTestimonials = await newTestimonial.save();
    res.status(201).json(savedTestimonials);
  } catch (error) {
    res.status(500).json({
      error: "Failed to add testimonial",
      details: error.message,
    });
  }
});

export default router;