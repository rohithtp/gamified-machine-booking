import Avatar from 'boring-avatars';

const avatarVariants = ['beam', 'sunset', 'ring', 'pixel', 'bauhaus'];
const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

export default function AvatarSelector({ avatar, setAvatar, readOnly = false, size = 40, showTitle = true }) {
  return (
    <div className="avatar-selector">
      {showTitle && <h3>Select Your Avatar:</h3>}
      <div>
        {avatarVariants.map(variant => (
          <div
            key={variant}
            onClick={readOnly ? undefined : () => setAvatar(variant)}
            style={{ 
              cursor: readOnly ? 'default' : 'pointer', 
              margin: '0 8px', 
              display: 'inline-block',
              border: avatar === variant ? '2px solid #007bff' : 'none',
              borderRadius: '50%',
              padding: '2px',
              opacity: readOnly && avatar !== variant ? 0.3 : 1
            }}
          >
            <Avatar
              size={size}
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