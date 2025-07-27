import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './CalendarView.css';

export default function CalendarView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [groupedBookings, setGroupedBookings] = useState({
    past: [],
    future: [],
    today: []
  });

  useEffect(() => {
    const userId = api.getCurrentUser();
    if (userId) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      groupBookings();
    }
  }, [bookings]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      const userId = api.getCurrentUser();
      const userBookings = userId ? data.filter(booking => booking.userId === userId) : [];
      setBookings(userBookings);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupBookings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const grouped = {
      past: [],
      future: [],
      today: []
    };

    bookings.forEach(booking => {
      const bookingDate = new Date(booking.date);
      const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
      
      if (bookingDateOnly < today) {
        grouped.past.push(booking);
      } else if (bookingDateOnly.getTime() === today.getTime()) {
        grouped.today.push(booking);
      } else {
        grouped.future.push(booking);
      }
    });

    // Sort past bookings by date (newest first)
    grouped.past.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Sort future bookings by date (oldest first)
    grouped.future.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Sort today's bookings by time
    grouped.today.sort((a, b) => new Date(a.date) - new Date(b.date));

    setGroupedBookings(grouped);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const getBookingsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateString);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayBookings = getBookingsForDate(date);
      const hasBookings = dayBookings.length > 0;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${hasBookings ? 'has-bookings' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <span className="day-number">{day}</span>
          {hasBookings && (
            <div className="booking-indicator">
              <span className="booking-count">{dayBookings.length}</span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderBookingList = (bookings, title, className) => (
    <div className={`booking-group ${className}`}>
      <h3 className="group-title">{title} ({bookings.length})</h3>
      {bookings.length === 0 ? (
        <p className="no-bookings">No {title.toLowerCase()} bookings</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h4>{booking.machine}</h4>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}</p>
                <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading calendar...</div>
      </div>
    );
  }

  const currentUserId = api.getCurrentUser();
  if (!currentUserId) {
    return (
      <div className="container">
        <div className="calendar-header">
          <h1>Booking Calendar</h1>
        </div>
        <p>Please select a user to view the calendar.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadBookings}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container calendar-page">
      <div className="calendar-header">
        <h1>Booking Calendar</h1>
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
        <a href="/" className="back-link">← Back to Booking</a>
      </div>

      {viewMode === 'calendar' ? (
        <div className="calendar-container">
          <div className="calendar-navigation">
            <button onClick={() => navigateMonth(-1)} className="nav-btn">← Previous</button>
            <h2 className="current-month">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="nav-btn">Next →</button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>

          {selectedDate && (
            <div className="selected-date-bookings">
              <h3>Bookings for {selectedDate.toLocaleDateString()}</h3>
              {getBookingsForDate(selectedDate).length === 0 ? (
                <p>No bookings for this date</p>
              ) : (
                <div className="bookings-grid">
                  {getBookingsForDate(selectedDate).map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <h4>{booking.machine}</h4>
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-details">
                        <p><strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="list-view">
          {renderBookingList(groupedBookings.today, 'Today', 'today-group')}
          {renderBookingList(groupedBookings.future, 'Upcoming', 'future-group')}
          {renderBookingList(groupedBookings.past, 'Past', 'past-group')}
        </div>
      )}
    </div>
  );
} 