// server.js
const express = require('express');
const cors = require('cors');
const MobileSystem = require('./database'); // Import mongoose model

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Add a new user
app.post('/adduser', async (req, res) => {
  const { users_name, phone_number, description, operator_name, country_name, country_code } = req.body;
  try {
    const existingUser = await MobileSystem.findOne({ phone_nbr: phone_number });
    if (existingUser) {
      return res.status(200).json({
        message: 'Phone number already exists',
        user: existingUser,
      });
    }
    const newUser = new MobileSystem({
      users_name,
      phone_nbr: phone_number,
      description,
      operator_name,
      country_name,
      country_code,
    });
    await newUser.save();
    return res.status(201).json({
      message: 'New user added',
      user: newUser,
    });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Edit user
app.put('/edituser/:phone_nbr', async (req, res) => {
  const { phone_nbr } = req.params;
  const { users_name, phone_number, description, operator_name, country_name, country_code } = req.body;
  try {
    const updatedUser = await MobileSystem.findOneAndUpdate(
      { phone_nbr },
      {
        users_name,
        phone_nbr: phone_number,
        description,
        operator_name,
        country_name,
        country_code,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// ✅ Delete user
app.delete('/deleteuser/:phone_nbr', async (req, res) => {
  const { phone_nbr } = req.params;
  try {
    const deletedUser = await MobileSystem.findOneAndDelete({ phone_nbr });
    if (!deletedUser) {
      return res.status(404).send('User not found.');
    }
    res.send(`User with phone_nbr ${phone_nbr} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user.');
  }
});

// ✅ Get user by phone number
app.post('/getuser/:phone_nbr', async (req, res) => {
  const { phone_nbr } = req.params;
  try {
    const user = await MobileSystem.findOne({ phone_nbr });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

app.get('/getallusers', async (req, res) => {
  try {
    const users = await MobileSystem.find();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Start the server
app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
