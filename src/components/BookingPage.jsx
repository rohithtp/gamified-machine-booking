import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import GamificationPanel from './GamificationPanel';
import AvatarSelector from './AvatarSelector';
import UserSelector from './UserSelector';
import Animation from './Animation';
import { api } from '../services/api';

export default function BookingPage() {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [avatar, setAvatar] = useState("beam");
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const userId = api.getCurrentUser();
    if (userId) {
      loadUserData(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUserSelect = (userId) => {
    setCurrentUser(userId);
    loadUserData(userId);
  };

  const loadUserData = async (userId) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const userData = await api.getUserGamification();
      setPoints(userData.points);
      setBadges(userData.badges);
      setAvatar(userData.avatar);
    } catch (err) {
      console.error('Failed to load user data:', err);
      // Clear the invalid user ID and show user selector
      api.setCurrentUser(null);
      setError(null); // Don't show error, just let user select again
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (machine, date) => {
    try {
      await api.createBooking(machine, date);
      setShowAnimation(true);
      
      // Reload user data to get updated points and badges
      const userId = api.getCurrentUser();
      if (userId) {
        await loadUserData(userId);
      }
      
      setTimeout(() => setShowAnimation(false), 2000);
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking. Please try again.');
    }
  };

  const handleAvatarChange = async (newAvatar) => {
    try {
      await api.updateUserAvatar(newAvatar);
      setAvatar(newAvatar);
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setError('Failed to update avatar. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadUserData}>Retry</button>
        </div>
      </div>
    );
  }

  const currentUserId = api.getCurrentUser();
  if (!currentUserId) {
    return (
      <div className="container">
        <h1>Gamified Machine Booking</h1>
        <UserSelector onUserSelect={handleUserSelect} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Gamified Machine Booking</h1>
      <UserSelector onUserSelect={handleUserSelect} />
      <AvatarSelector avatar={avatar} setAvatar={handleAvatarChange} />
      <GamificationPanel points={points} badges={badges} avatar={avatar} />
      <BookingForm onBook={handleBooking} />
      {showAnimation && <Animation />}
    </div>
  );
} 