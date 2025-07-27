const API_BASE_URL = 'http://localhost:3001/api';

// Get current user ID (in a real app, this would come from authentication)
const getCurrentUserId = () => {
  return localStorage.getItem('currentUserId');
};

// Set current user ID
const setCurrentUserId = (userId) => {
  localStorage.setItem('currentUserId', userId);
};

export const api = {
  // Booking endpoints
  async getBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  async createBooking(machine, date) {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('No user selected. Please select a user first.');
    }
    
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        machine,
        date,
        userId
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
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('No user selected. Please select a user first.');
    }
    const response = await fetch(`${API_BASE_URL}/gamification/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user gamification data');
    return response.json();
  },

  async updateUserAvatar(avatar) {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('No user selected. Please select a user first.');
    }
    const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar }),
    });
    if (!response.ok) throw new Error('Failed to update avatar');
    return response.json();
  },

  async getRandomAvatar() {
    const response = await fetch(`${API_BASE_URL}/avatar/random`);
    if (!response.ok) throw new Error('Failed to get random avatar');
    return response.json();
  },

  // Machine endpoints
  async getMachines() {
    const response = await fetch(`${API_BASE_URL}/machines`);
    if (!response.ok) throw new Error('Failed to fetch machines');
    return response.json();
  },

  async createMachine(machineData) {
    const response = await fetch(`${API_BASE_URL}/machines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(machineData),
    });
    if (!response.ok) throw new Error('Failed to create machine');
    return response.json();
  },

  async updateMachine(machineId, machineData) {
    const response = await fetch(`${API_BASE_URL}/machines/${machineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(machineData),
    });
    if (!response.ok) throw new Error('Failed to update machine');
    return response.json();
  },

  async deleteMachine(machineId) {
    const response = await fetch(`${API_BASE_URL}/machines/${machineId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete machine');
    return response.json();
  },

  async getMachine(machineId) {
    const response = await fetch(`${API_BASE_URL}/machines/${machineId}`);
    if (!response.ok) throw new Error('Failed to fetch machine');
    return response.json();
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Server is not responding');
    return response.json();
  },

  // User management endpoints
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  async getUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // User session management
  setCurrentUser(userId) {
    setCurrentUserId(userId);
  },

  getCurrentUser() {
    return getCurrentUserId();
  }
}; 