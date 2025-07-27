import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './components/BookingPage';
import BookingsPage from './components/BookingsPage';

export default function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav-bar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🎮 Gamified Booking
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Book Machine</Link>
              <Link to="/bookings" className="nav-link">My Bookings</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}