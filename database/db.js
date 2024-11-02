const mongoose = require('mongoose');
require('dotenv').config();

const session = mongoose.connect(process.env.mongodb)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true,index:true },
    email: {type:String,default:null},
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, required: true, minLength: 6 },
    lastActive: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) { 
    this.lastActive = Date.now();
    next();
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index:true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = { User, Account };
