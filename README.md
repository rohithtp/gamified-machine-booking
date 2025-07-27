# Gamified Machine Booking

A web application for booking systems with gamified UI featuring points, badges, avatars, and animations. The app now includes backend storage using NeDB for data persistence.

## Features

- **Machine Booking**: Book various types of machines (3D Printer, Laser Cutter, CNC Machine, etc.)
- **Gamification**: Earn points and unlock badges for your bookings
- **Avatar System**: Choose from different avatars to personalize your experience
- **Animations**: Enjoy celebratory animations when making bookings
- **Persistent Storage**: All data is stored in NeDB databases on the backend
- **User Sessions**: Automatic user ID generation for session management
- **Booking Management**: View, edit, and delete your bookings with full CRUD operations
- **Navigation**: Easy navigation between booking and management pages

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
- `GET /api/gamification/:userId` - Get user gamification data
- `PUT /api/gamification/:userId/avatar` - Update user avatar

## Data Storage

The application uses three NeDB databases stored in `server/data/`:

- `bookings.db` - Stores all booking records
- `users.db` - Stores user information (future use)
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

### Avatars
- Choose from multiple avatar options
- Avatar selection is saved and persists across sessions

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