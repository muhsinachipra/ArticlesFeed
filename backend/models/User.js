// backend\models\User.js

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    dob: { type: Date },
    password: { type: String, required: true },
    preferences: [{ type: String }],  // List of preferred categories
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = model('User', userSchema);
export default User;
