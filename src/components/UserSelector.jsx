import React, { useState, useEffect } from 'react';
import AvatarSelector from './AvatarSelector';
import { api } from '../services/api';

export default function UserSelector({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(api.getCurrentUser());

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    api.setCurrentUser(userId);
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };

  if (loading) {
    return <div className="user-selector">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="user-selector">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadUsers}>Retry</button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-selector">
        <div className="no-users-message">
          <h3>No Users Available</h3>
          <p>You need to create users before you can make bookings.</p>
          <div className="no-users-actions">
            <a href="/users" className="btn-primary">Go to User Management</a>
            <p className="help-text">Create your first user in the Users page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-selector">
      <h3>Select User:</h3>
      <div className="user-options">
        {users.map(user => (
          <div
            key={user._id}
            className={`user-option ${selectedUserId === user._id ? 'selected' : ''}`}
            onClick={() => handleUserSelect(user._id)}
          >
            <AvatarSelector
              avatar={user.avatar}
              setAvatar={() => {}}
              readOnly={true}
              size={40}
              showTitle={false}
            />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            {selectedUserId === user._id && (
              <span className="selected-indicator">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 