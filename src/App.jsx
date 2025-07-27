import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import GamificationPanel from './components/GamificationPanel';
import AvatarSelector from './components/AvatarSelector';
import Animation from './components/Animation';

export default function App() {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [avatar, setAvatar] = useState("avatar1.png");
  const [showAnimation, setShowAnimation] = useState(false);

  const handleBooking = () => {
    setPoints(prev => prev + 10);
    setShowAnimation(true);

    // Badges logic
    if (points + 10 >= 50 && !badges.includes('Super Booker')) {
      setBadges(prev => [...prev, 'Super Booker']);
    }
    if (points + 10 === 10 && !badges.includes('First Booking')) {
      setBadges(prev => [...prev, 'First Booking']);
    }
    setTimeout(() => setShowAnimation(false), 2000);
  };

  return (
    <div className="container">
      <h1>Gamified Machine Booking</h1>
      <AvatarSelector avatar={avatar} setAvatar={setAvatar} />
      <GamificationPanel points={points} badges={badges} avatar={avatar} />
      <BookingForm onBook={handleBooking} />
      {showAnimation && <Animation />}
    </div>
  );
}