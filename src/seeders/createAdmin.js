import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import connectDB from '../connection/db.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();
        
        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ email: 'admin@tourAgency.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Crear usuario admin
        const passwordHash = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            username: 'admin',
            email: 'admin@tourAgency.com',
            password: passwordHash,
            role: 'admin',
            fullName: 'Administrator',
            phone: '+1234567890',
            address: 'Admin Office'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@tourAgency.com');
        console.log('Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();