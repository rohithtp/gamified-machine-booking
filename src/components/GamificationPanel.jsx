import React from 'react';
import Avatar from 'boring-avatars';

const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

export default function GamificationPanel({ points, badges, avatar }) {
  return (
    <div className="gamification-panel">
      <div className="avatar-container">
        <Avatar
          size={60}
          name={avatar}
          variant={avatar}
          colors={colors}
        />
      </div>
      <div>
        <p><strong>Points:</strong> {points}</p>
        <p><strong>Badges:</strong> {badges.length > 0 ? badges.join(', ') : 'None yet'}</p>
      </div>
    </div>
  );
}