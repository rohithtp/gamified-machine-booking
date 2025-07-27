import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import GamificationPanel from './GamificationPanel';
import AvatarSelector from './AvatarSelector';
import Animation from './Animation';
import { api } from '../services/api';

export default function BookingPage() {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [avatar, setAvatar] = useState("avatar1.png");
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await api.getUserGamification();
      setPoints(userData.points);
      setBadges(userData.badges);
      setAvatar(userData.avatar);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load user data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (machine, date) => {
    try {
      await api.createBooking(machine, date);
      setShowAnimation(true);
      
      // Reload user data to get updated points and badges
      await loadUserData();
      
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

  return (
    <div className="container">
      <h1>Gamified Machine Booking</h1>
      <AvatarSelector avatar={avatar} setAvatar={handleAvatarChange} />
      <GamificationPanel points={points} badges={badges} avatar={avatar} />
      <BookingForm onBook={handleBooking} />
      {showAnimation && <Animation />}
    </div>
  );
} 