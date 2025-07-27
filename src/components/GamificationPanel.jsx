import React from 'react';
import AvatarSelector from './AvatarSelector';

export default function GamificationPanel({ points, badges, avatar }) {
  return (
    <div className="gamification-panel">
      <div className="avatar-container">
        <AvatarSelector
          avatar={avatar}
          setAvatar={() => {}}
          readOnly={true}
          size={60}
          showTitle={false}
        />
      </div>
      <div>
        <p><strong>Points:</strong> {points}</p>
        <p><strong>Badges:</strong> {badges.length > 0 ? badges.join(', ') : 'None yet'}</p>
      </div>
    </div>
  );
}