const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scheduling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const UserSchema = new mongoose.Schema({
  email: String,
  availability: [
    {
      day: String,
      start: String,
      end: String,
    }
  ],
});

const User = mongoose.model('User', UserSchema);

// Basic login endpoint
app.post('/login', async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, availability: [] });
    await user.save();
  }
  res.json(user);
});

// Endpoint to save availability
app.post('/availability', async (req, res) => {
  const { day, start, end, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.availability.push({ day, start, end });
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
