import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    loadBookings();
    loadMachines();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMachines = async () => {
    try {
      const data = await api.getMachines();
      setMachines(data);
    } catch (err) {
      console.error('Error loading machines:', err);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.deleteBooking(bookingId);
        await loadBookings(); // Reload the list
      } catch (err) {
        setError('Failed to delete booking');
        console.error('Error deleting booking:', err);
      }
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateBooking(editingBooking._id, {
        machine: editingBooking.machine,
        date: editingBooking.date,
        status: editingBooking.status
      });
      setEditingBooking(null);
      await loadBookings(); // Reload the list
    } catch (err) {
      setError('Failed to update booking');
      console.error('Error updating booking:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading bookings...</div>
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
    <div className="container">
      <div className="bookings-header">
        <h1>Bookings Management</h1>
        <a href="/" className="back-link">← Back to Booking</a>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found. Create your first booking!</p>
          <a href="/" className="btn-primary">Make a Booking</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              {editingBooking && editingBooking._id === booking._id ? (
                // Edit form
                <form onSubmit={handleUpdate} className="booking-edit-form">
                  <div className="form-row">
                    <label>
                      Machine:
                      <select
                        value={editingBooking.machine}
                        onChange={(e) => setEditingBooking({
                          ...editingBooking,
                          machine: e.target.value
                        })}
                        required
                      >
                        {machines.map(m => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({m.type})
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Date:
                      <input
                        type="date"
                        value={editingBooking.date}
                        onChange={(e) => setEditingBooking({
                          ...editingBooking,
                          date: e.target.value
                        })}
                        required
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Status:
                      <select
                        value={editingBooking.status}
                        onChange={(e) => setEditingBooking({
                          ...editingBooking,
                          status: e.target.value
                        })}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save">Save</button>
                    <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display mode
                <div className="booking-info">
                  <div className="booking-header">
                    <h3>{booking.machine}</h3>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                    <p><strong>Booked on:</strong> {formatDateTime(booking.createdAt)}</p>
                    <p><strong>User ID:</strong> {booking.userId}</p>
                  </div>
                  <div className="booking-actions">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 