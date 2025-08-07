import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`MongoDB connected: ${connection.connection.host}, ${connection.connection.name}`);
    } catch(error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB; 