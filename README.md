# Gamified Machine Booking

A web application for booking systems with gamified UI featuring points, badges, avatars, and animations. The app now includes backend storage using NeDB for data persistence.

## Features

- **Machine Booking**: Book various types of machines (3D Printer, Laser Cutter, CNC Machine, etc.)
- **System Management**: Create, edit, and manage machines/systems with detailed information
- **User Management**: Create, edit, and manage user profiles with avatars
- **Gamification**: Earn points and unlock badges for your bookings
- **Avatar System**: Choose from different avatars to personalize your experience
- **Animations**: Enjoy celebratory animations when making bookings
- **Persistent Storage**: All data is stored in NeDB databases on the backend
- **User Sessions**: Select and switch between different user profiles
- **Booking Management**: View, edit, and delete your bookings with full CRUD operations
- **Navigation**: Easy navigation between booking, user management, system management, and booking management pages

## Tech Stack

- **Frontend**: React 18
- **Backend**: Express.js
- **Database**: NeDB (@seald-io/nedb)
- **Styling**: CSS3 with animations

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gamified-machine-booking
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (Recommended)
Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend development server on http://localhost:3000

### Separate Mode
If you prefer to run frontend and backend separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm start
```

## Testing

Run the test suite to verify the API functionality:

```bash
npm test
```

This will test all API endpoints and provide a detailed summary of results.

For more information about testing, see the [tests/README.md](tests/README.md) file.

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `GET /api/machines` - Get available machines
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/:id` - Get user by ID
- `GET /api/machines` - Get all machines
- `POST /api/machines` - Create a new machine
- `PUT /api/machines/:id` - Update a machine
- `DELETE /api/machines/:id` - Delete a machine
- `GET /api/machines/:id` - Get machine by ID
- `GET /api/gamification/:userId` - Get user gamification data
- `PUT /api/gamification/:userId/avatar` - Update user avatar

## Data Storage

The application uses four NeDB databases stored in `server/data/`:

- `bookings.db` - Stores all booking records
- `users.db` - Stores user information and profiles
- `machines.db` - Stores machine/system information
- `gamification.db` - Stores user points, badges, and avatar preferences

## Gamification System

### Points
- Earn 10 points for each booking
- Points are persistent across sessions

### Badges
- **First Booking**: Earned after your first booking (10 points)
- **Super Booker**: Earned at 50 points
- **Regular User**: Earned after 5 bookings
- **Power User**: Earned after 10 bookings

### System Management
- Create and manage machines/systems with names, types, descriptions, and locations
- Support for multiple machine types (manufacturing, simulation, electronics, research, etc.)
- Machines can be activated or deactivated (inactive machines won't appear in booking form)
- Visual icons for different machine types
- Full CRUD operations for system management

### User Management
- Create and manage user profiles with names, emails, and avatars
- Each user has their own gamification data (points, badges)
- Users can be activated or deactivated
- User avatars are synchronized between user profiles and gamification data

### Avatars
- Choose from multiple avatar options (beam, sunset, ring, pixel, bauhaus)
- Avatar selection is saved and persists across sessions
- Avatars are tied to user profiles

## Project Structure

```
gamified-machine-booking/
├── public/
│   └── index.html
├── server/
│   ├── data/           # NeDB database files
│   └── index.js        # Express server
├── src/
│   ├── components/     # React components
│   │   ├── AvatarSelector.jsx    # Avatar selection component
│   │   ├── BookingForm.jsx       # Machine booking form
│   │   ├── BookingPage.jsx       # Main booking page
│   │   ├── BookingsPage.jsx      # Booking management page
│   │   ├── GamificationPanel.jsx # Points and badges display
│   │   ├── UserSelector.jsx      # User selection component
│   │   ├── UsersPage.jsx         # User management page
│   │   └── SystemsPage.jsx       # System management page
│   ├── services/       # API service layer
│   ├── App.jsx         # Main app component
│   ├── index.js        # React entry point
│   └── styles.css      # Global styles
├── tests/
│   ├── api.test.js     # API test suite
│   ├── run-tests.js    # Test runner
│   └── README.md       # Test documentation
├── package.json
└── README.md
```

## Development

### Adding New Features
1. Backend changes: Modify `server/index.js`
2. Frontend changes: Modify components in `src/components/`
3. API integration: Use the service layer in `src/services/api.js`

### Database Management
- NeDB databases are automatically created in `server/data/`
- Data persists between server restarts
- For development, you can delete the `.db` files to reset data

## Troubleshooting

### Server Connection Issues
- Ensure the backend server is running on port 3001
- Check that CORS is properly configured
- Verify the API base URL in `src/services/api.js`

### Data Persistence Issues
- Check that the `server/data/` directory exists
- Ensure write permissions for the data directory
- Verify NeDB database files are not corrupted

## License

This project is licensed under the MIT License.