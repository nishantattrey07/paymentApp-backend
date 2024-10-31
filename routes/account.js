const express = require('express');
const authMiddleware = require('../middleware/auth');
const { Account,User } = require('../database/db');
const mongoose = require('mongoose');
const z = require('zod');
const router = express.Router();


const receiverSchema = z.object({
    to: z.string(),
    amount: z.number()
})

router.get('/',(req, res) => { 
    
   return  res.send("This is route to api/v1/account/ ");
})

router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId;
    
    const account = await Account.findOne({ userId: userId });
    
    return res.status(200).json({balance:account.balance});
})

router.post('/transfer', authMiddleware, async (req, res) => { 
    const receiver = req.body;
    const userId = req.userId;
    const result = receiverSchema.safeParse(receiver);
    if (!result.success) { 
        return res.status(400).json({
            message:"Invalid details"
        })
    }
    
    const receiverAccount = await User.findOne({ username: receiver.to });
    if (!receiverAccount) { 
        return res.status(404).json({
            message: "Receiver not found"
        })
    }
    
    const checkBalance = await Account.findOne({ userId: userId });
    if (checkBalance.balance < receiver.amount) { 
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const receiverUserId = receiverAccount._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await Account.updateOne({ userId: userId }, { $inc: { balance: -receiver.amount } }, {session})
        await Account.updateOne({ userId: receiverUserId }, { $inc: { balance: receiver.amount } }, {session})
        await session.commitTransaction();
        return res.status(200).json({
            message: "Amount transferred successfully"
        })
    }
    catch (err) {
        await session.abortTransaction();
        return res.status(500).json({
            message: "Internal server error"
        })
    }
    finally { 
        session.endSession();
    }

    

    
})


module.exports = router;