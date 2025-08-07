import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // en días
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableDates: [{
        type: Date,
        required: true
    }],
    image: {
        type: String // URL de la imagen
    },
    maxCapacity: {
        type: Number,
        default: 20
    },
    destination: {
        type: String,
        required: true
    },
    includes: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard'],
        default: 'moderate'
    }
}, {
    timestamps: true
});

export default mongoose.model('Tour', tourSchema);