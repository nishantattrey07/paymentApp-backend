const express = require('express');
const router = express.Router();
const z = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const userSchema = z.object({
    username: z.string().min(3).max(30),
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(30),
    password: z.string().min(6)
})

const signInSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6)
})

const updateSchema = z.object({
    password: z.string().min(6).optional(),
    firstName: z.string().min(3).max(30).optional(),
    lastName: z.string().min(3).max(30).optional()
})

router.get('/', (req, res) => { 
    res.send("This is route to api/v1/user/ ");
})

router.post('/signup', async (req, res) => { 
    const user = req.body;
    const result = userSchema.safeParse(user);
    try { 
        if (result.success) {
            const userExist = await User.findOne({ username: user.username });
            if (userExist) { 
                return res.status(411).json({
                    message: "Email already taken / Incorrect inputs"
                });
            }
        
            const newUser = await User.create({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password
            })
            const userId = newUser._id;

            await Account.create({
                userId: userId,
                balance: Math.floor(Math.random() * 1000000)
            })
            const token = jwt.sign({userId},process.env.jwt_secret)
            res.json({
                message: "User Account created successfully",
                token: token
            })
        }
        else {
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            });
        }
    }
    catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    

})



router.post('/signin', async (req, res) => { 
    const user = req.body;
    const result = signInSchema.safeParse(user);
    if (!result.success) { 
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const userExist = await User.findOne({ username: user.username, password: user.password });
    if (!userExist) { 
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const userId = userExist._id;
    const token = jwt.sign({ userId }, process.env.jwt_secret);
    res.json({
        message: "User signed in successfully",
        token: token
    })

})

router.put('/', authMiddleware, async (req, res) => { 
    const result = updateSchema.safeParse(req.body);
    if (!result.success) { 
        return res.status(411).json({
            message: "Error while updating information"
        });
    }
    const userId = req.userId;
    await User.updateOne({ _id: userId }, req.body);
    res.status(200).json({
        message: "User updated successfully"
    })

})


router.get('/bulk', async (req, res) => { 
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                $regex: filter,
                $options: "i"
            }
        }, {
            lastName: {
                $regex: filter,
                $options:"i"
            }
        }]
    })

    res.json({
        user: users.map((user) => {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                _id: user._id
            }
         })
    })

})

module.exports=router