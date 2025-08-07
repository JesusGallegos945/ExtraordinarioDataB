import Tour from "../models/tour.js";

export const createTour = async (req, res) => {
    try {
        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();
        res.json(savedTour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: "Tour not found" });
        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTour) return res.status(404).json({ message: "Tour not found" });
        res.json(updatedTour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) return res.status(404).json({ message: "Tour not found" });
        res.json({ message: "Tour deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchTours = async (req, res) => {
    try {
        const { destination, minPrice, maxPrice, difficulty } = req.query;
        let query = {};
        
        if (destination) {
            query.destination = { $regex: destination, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        
        const tours = await Tour.find(query);
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};