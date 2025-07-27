import Avatar from 'boring-avatars';

const avatarVariants = ['beam', 'sunset', 'ring', 'pixel', 'bauhaus'];
const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

export default function AvatarSelector({ avatar, setAvatar }) {
  return (
    <div className="avatar-selector">
      <h3>Select Your Avatar:</h3>
      <div>
        {avatarVariants.map(variant => (
          <div
            key={variant}
            onClick={() => setAvatar(variant)}
            style={{ 
              cursor: 'pointer', 
              margin: '0 8px', 
              display: 'inline-block',
              border: avatar === variant ? '2px solid #007bff' : 'none',
              borderRadius: '50%',
              padding: '2px'
            }}
          >
            <Avatar
              size={40}
              name={variant}
              variant={variant}
              colors={colors}
            />
          </div>
        ))}
      </div>
    </div>
  );
}