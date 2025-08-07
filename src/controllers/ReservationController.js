import Reservation from "../models/reservation.js";
import Tour from "../models/tour.js";
import User from "../models/user.js";

export const createReservation = async (req, res) => {
    try {
        const tour = await Tour.findById(req.body.tour);
        if (!tour) return res.status(404).json({ message: "Tour not found" });

        const reservation = new Reservation({
            ...req.body,
            customer: req.user.id,
            totalPrice: tour.price * req.body.numberOfPeople
        });

        const savedReservation = await reservation.save();
        await savedReservation.populate('tour', 'name duration price destination');
        res.json(savedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('customer', 'username fullName email phone')
            .populate('tour', 'name duration price destination');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ customer: req.user.id })
            .populate('tour', 'name duration price destination image');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('customer', 'username fullName email phone')
            .populate('tour', 'name duration price destination');
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('tour', 'name duration price destination');
        if (!updatedReservation) return res.status(404).json({ message: "Reservation not found" });
        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) return res.status(404).json({ message: "Reservation not found" });
        res.json({ message: "Reservation cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('customer', 'username fullName email')
         .populate('tour', 'name duration price destination');
        if (!updatedReservation) return res.status(404).json({ message: "Reservation not found" });
        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};