import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './components/BookingPage';
import BookingsPage from './components/BookingsPage';
import UsersPage from './components/UsersPage';
import SystemsPage from './components/SystemsPage';

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
              <Link to="/users" className="nav-link">Users</Link>
              <Link to="/systems" className="nav-link">Systems</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/systems" element={<SystemsPage />} />
        </Routes>
      </div>
    </Router>
  );
}