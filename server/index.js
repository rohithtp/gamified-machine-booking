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
      // Check if user exists in users database
      usersDb.findOne({ _id: userId }, (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else {
          // Create new gamification data for existing user
          const newUserData = {
            userId,
            points: 0,
            badges: [],
            totalBookings: 0
          };
          gamificationDb.insert(newUserData, (err, inserted) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json(inserted);
            }
          });
        }
      });
    } else {
      res.json(data);
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

// Initialize machines database
const machinesDb = new Datastore({ filename: path.join(__dirname, 'data/machines.db'), autoload: true });

// Get available machines
app.get('/api/machines', (req, res) => {
  machinesDb.find({}, (err, machines) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(machines);
    }
  });
});

// Systems Management API Routes

// Create a new machine
app.post('/api/machines', (req, res) => {
  const { name, type, description, location, isActive } = req.body;
  
  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Machine name is required' });
  }
  if (!type || !type.trim()) {
    return res.status(400).json({ error: 'Machine type is required' });
  }
  
  const machine = {
    name: name.trim(),
    type: type.trim(),
    description: description || '',
    location: location || '',
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date()
  };

  machinesDb.insert(machine, (err, newMachine) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(newMachine);
    }
  });
});

// Update a machine
app.put('/api/machines/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, description, location, isActive } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Machine name is required' });
  }
  if (!type || !type.trim()) {
    return res.status(400).json({ error: 'Machine type is required' });
  }

  machinesDb.update(
    { _id: id },
    { $set: { 
      name: name.trim(), 
      type: type.trim(), 
      description, 
      location, 
      isActive 
    }},
    {},
    (err, numUpdated) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (numUpdated === 0) {
        res.status(404).json({ error: 'Machine not found' });
      } else {
        res.json({ success: true, numUpdated });
      }
    }
  );
});

// Delete a machine
app.delete('/api/machines/:id', (req, res) => {
  const { id } = req.params;

  machinesDb.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (numRemoved === 0) {
      res.status(404).json({ error: 'Machine not found' });
    } else {
      res.json({ success: true, numRemoved });
    }
  });
});

// Get machine by ID
app.get('/api/machines/:id', (req, res) => {
  const { id } = req.params;

  machinesDb.findOne({ _id: id }, (err, machine) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!machine) {
      res.status(404).json({ error: 'Machine not found' });
    } else {
      res.json(machine);
    }
  });
});

// User Management API Routes

// Get all users
app.get('/api/users', (req, res) => {
  usersDb.find({}, (err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(users);
    }
  });
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email, avatar } = req.body;
  
  // Generate random avatar if not provided
  const avatarVariants = ['beam', 'sunset', 'ring', 'pixel', 'bauhaus'];
  const randomAvatar = avatar || avatarVariants[Math.floor(Math.random() * avatarVariants.length)];
  
  const user = {
    name,
    email,
    avatar: randomAvatar,
    createdAt: new Date(),
    isActive: true
  };

  usersDb.insert(user, (err, newUser) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Create gamification data for the new user
      const gamificationData = {
        userId: newUser._id,
        points: 0,
        badges: [],
        totalBookings: 0
      };
      gamificationDb.insert(gamificationData);
      res.json(newUser);
    }
  });
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, avatar, isActive } = req.body;

  usersDb.update(
    { _id: id },
    { $set: { name, email, avatar, isActive } },
    {},
    (err, numUpdated) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (numUpdated === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        // Avatar is now managed in the user model only
        res.json({ success: true, numUpdated });
      }
    }
  );
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  usersDb.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (numRemoved === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Also remove gamification data
      gamificationDb.remove({ userId: id }, {});
      res.json({ success: true, numRemoved });
    }
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  usersDb.findOne({ _id: id }, (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  });
});

// Update user avatar (moved to user management)
app.put('/api/users/:userId/avatar', (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;

  usersDb.update(
    { _id: userId },
    { $set: { avatar } },
    {},
    (err, numUpdated) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (numUpdated === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ success: true, numUpdated });
      }
    }
  );
});

// Generate random avatar
app.get('/api/avatar/random', (req, res) => {
  const avatarVariants = ['beam', 'sunset', 'ring', 'pixel', 'bauhaus'];
  const randomAvatar = avatarVariants[Math.floor(Math.random() * avatarVariants.length)];
  res.json({ avatar: randomAvatar });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 