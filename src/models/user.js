import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        required: true,
        default: 'admin'
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    }
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);