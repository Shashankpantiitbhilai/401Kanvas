const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdminUser = async () => {
    try {
        await mongoose.connect('mongodb+srv://shashankpant94115:ST0Io2DYTc1I1on6@cluster0.3alwvln.mongodb.net/newsletter_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create new admin user
        const adminUser = new User({
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser(); 