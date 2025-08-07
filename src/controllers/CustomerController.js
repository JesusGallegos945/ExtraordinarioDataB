import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id).select('-password');
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        
        // Generar username y password por defecto
        const username = email.split('@')[0];
        const defaultPassword = 'customer123';
        const passwordHash = await bcrypt.hash(defaultPassword, 10);
        
        const newCustomer = new User({
            username,
            email,
            password: passwordHash,
            role: 'customer',
            fullName: name,
            phone,
            address
        });
        
        const savedCustomer = await newCustomer.save();
        const { password: _, ...customerData } = savedCustomer.toObject();
        res.json(customerData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const updatedCustomer = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await User.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchCustomers = async (req, res) => {
    try {
        const { name, email } = req.query;
        let query = { role: 'admin' };
        
        if (name) {
            query.$or = [
                { fullName: { $regex: name, $options: 'i' } },
                { username: { $regex: name, $options: 'i' } }
            ];
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }
        
        const customers = await User.find(query).select('-password');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};