const express = require('express');
const cors = require('cors');
const path = require('path');
const Datastore = require('@seald-io/nedb');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize NeDB databases
const bookingsDb = new Datastore({ filename: path.join(__dirname, 'data/bookings.db'), autoload: true });
const usersDb = new Datastore({ filename: path.join(__dirname, 'data/users.db'), autoload: true });
const gamificationDb = new Datastore({ filename: path.join(__dirname, 'data/gamification.db'), autoload: true });

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// API Routes

// Get all bookings
app.get('/api/bookings', (req, res) => {
  bookingsDb.find({}, (err, bookings) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(bookings);
    }
  });
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
  const { machine, date, userId } = req.body;
  const booking = {
    machine,
    date,
    userId,
    createdAt: new Date(),
    status: 'confirmed'
  };

  bookingsDb.insert(booking, (err, newBooking) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Update user points and badges
      updateUserGamification(userId, 10);
      res.json(newBooking);
    }
  });
});

// Update a booking
app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { machine, date, status } = req.body;

  bookingsDb.update(
    { _id: id },
    { $set: { machine, date, status } },
    {},
    (err, numUpdated) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (numUpdated === 0) {
        res.status(404).json({ error: 'Booking not found' });
      } else {
        res.json({ success: true, numUpdated });
      }
    }
  );
});

// Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;

  bookingsDb.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (numRemoved === 0) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      res.json({ success: true, numRemoved });
    }
  });
});

// Get user gamification data
app.get('/api/gamification/:userId', (req, res) => {
  const { userId } = req.params;
  
  gamificationDb.findOne({ userId }, (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!data) {
      // Create new user data if doesn't exist
      const newUserData = {
        userId,
        points: 0,
        badges: [],
        avatar: 'avatar1.png',
        totalBookings: 0
      };
      gamificationDb.insert(newUserData, (err, inserted) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(inserted);
        }
      });
    } else {
      res.json(data);
    }
  });
});

// Update user avatar
app.put('/api/gamification/:userId/avatar', (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;

  gamificationDb.update({ userId }, { $set: { avatar } }, {}, (err, numUpdated) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true, numUpdated });
    }
  });
});

// Helper function to update user gamification
function updateUserGamification(userId, pointsToAdd) {
  gamificationDb.findOne({ userId }, (err, data) => {
    if (err) {
      console.error('Error finding user:', err);
      return;
    }

    if (!data) {
      // Create new user data
      const newUserData = {
        userId,
        points: pointsToAdd,
        badges: pointsToAdd >= 10 ? ['First Booking'] : [],
        avatar: 'avatar1.png',
        totalBookings: 1
      };
      gamificationDb.insert(newUserData);
    } else {
      // Update existing user data
      const newPoints = data.points + pointsToAdd;
      const newTotalBookings = data.totalBookings + 1;
      let newBadges = [...data.badges];

      // Badge logic
      if (newPoints >= 10 && !data.badges.includes('First Booking')) {
        newBadges.push('First Booking');
      }
      if (newPoints >= 50 && !data.badges.includes('Super Booker')) {
        newBadges.push('Super Booker');
      }
      if (newTotalBookings >= 5 && !data.badges.includes('Regular User')) {
        newBadges.push('Regular User');
      }
      if (newTotalBookings >= 10 && !data.badges.includes('Power User')) {
        newBadges.push('Power User');
      }

      gamificationDb.update(
        { userId },
        {
          $set: {
            points: newPoints,
            badges: newBadges,
            totalBookings: newTotalBookings
          }
        },
        {}
      );
    }
  });
}

// Get available machines
app.get('/api/machines', (req, res) => {
  const machines = [
    { id: 1, name: '3D Printer', type: 'manufacturing' },
    { id: 2, name: 'Laser Cutter', type: 'manufacturing' },
    { id: 3, name: 'CNC Machine', type: 'manufacturing' },
    { id: 4, name: 'VR Headset', type: 'simulation' },
    { id: 5, name: 'Arduino Kit', type: 'electronics' },
    { id: 6, name: 'Microscope', type: 'research' }
  ];
  res.json(machines);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 