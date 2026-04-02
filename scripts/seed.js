// scripts/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const seedUser = {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    role: 'Admin'
};

async function run() {
    if (!MONGO_URI) {
        console.error('MONGO_URI not set in environment. Aborting seeding.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        const existing = await User.findOne({ email: seedUser.email });
        if (existing) {
            console.log('Seed user already exists:', seedUser.email);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(seedUser.password, salt);

        const user = new User({
            name: seedUser.name,
            email: seedUser.email,
            password: hashed,
            role: seedUser.role
        });

        await user.save();
        console.log('Seed user created:', seedUser.email);
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

run();
