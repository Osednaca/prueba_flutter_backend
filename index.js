require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/user');
const app = express();
const mongoString = process.env.DATABASE_URL
 
mongoose.connect(mongoString)
const database = mongoose.connection
 
database.on('err', (err) => {
    console.log(err)
})
 
database.once('connected',
    () => {
        console.log('Database Connected to the server');
    })
 
app.use(express.json())
 
app.get('/', (req, res) => {
    res.send('Welcome to the users API!');
});
 
// Create a new user
app.post('/users', async (req, res) => {
    try {
        const newuser = new user(req.body);
        await newuser.save();
        res.status(201).json(newuser);
    } catch (error) {
        res.status(400)
            .json({ error: error.message });
    }
});
 
// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: error.message
                }
            );
    }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const users = await user.findById(req.params.id);
        res.json(users);
    } catch (error) {
        res.status(500)
            .json(
                {
                    error: error.message
                }
            );
    }
});

// Login
app.post('/login', async (req, res) => {
    let body = req.body;
    console.log(body);
    try {
        const finduser = await user.findOne({ email: body.email });

        if(!finduser){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }

        if(body.password != finduser.password){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }

        res.json({
            ok: true,
            user: finduser,
        })
    } catch (error) {
        console.log(error);
    }
});
 
// Delete a user by ID
app.delete('/users/:id',
    async (req, res) => {
        try {
            const user =
                await user.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404)
                    .json({ error: 'user not found' });
            }
            res.json({ message: 'user deleted successfully' });
        } catch (error) {
            res.status(500)
                .json({ error: error.message });
        }
    });
 
app.listen(3000, (req, res) => {
    console.log('Server is listening on port 3000');
});