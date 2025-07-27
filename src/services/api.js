const API_BASE_URL = 'http://localhost:3001/api';

// Generate a simple user ID (in a real app, this would come from authentication)
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const api = {
  // Booking endpoints
  async getBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  async createBooking(machine, date) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        machine,
        date,
        userId: getUserId()
      }),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  },

  async updateBooking(bookingId, bookingData) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  },

  async deleteBooking(bookingId) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete booking');
    return response.json();
  },

  // Gamification endpoints
  async getUserGamification() {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/gamification/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user gamification data');
    return response.json();
  },

  async updateUserAvatar(avatar) {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/gamification/${userId}/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar }),
    });
    if (!response.ok) throw new Error('Failed to update avatar');
    return response.json();
  },

  // Machine endpoints
  async getMachines() {
    const response = await fetch(`${API_BASE_URL}/machines`);
    if (!response.ok) throw new Error('Failed to fetch machines');
    return response.json();
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Server is not responding');
    return response.json();
  }
}; 