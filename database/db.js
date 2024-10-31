const mongoose = require('mongoose');
require('dotenv').config();

const session = mongoose.connect(process.env.mongodb)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true,unique:true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, required: true, minLength: 6 }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = { User, Account };
