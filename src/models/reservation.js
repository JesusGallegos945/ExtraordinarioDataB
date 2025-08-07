import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    specialRequests: {
        type: String
    },
    contactPhone: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: String,
        phone: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Reservation', reservationSchema);