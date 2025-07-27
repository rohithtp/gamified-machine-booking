import React, { useState, useEffect } from 'react';
import AvatarSelector from './AvatarSelector';
import { api } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', avatar: 'beam' });

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

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId);
        await loadUsers(); // Reload the list
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        avatar: editingUser.avatar,
        isActive: editingUser.isActive
      });
      setEditingUser(null);
      await loadUsers(); // Reload the list
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(newUser);
      setNewUser({ name: '', email: '', avatar: 'beam' });
      setShowAddForm(false);
      await loadUsers(); // Reload the list
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewUser({ name: '', email: '', avatar: 'beam' });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="bookings-header">
        <h1>User Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New User
        </button>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={loadUsers}>Retry</button>
        </div>
      )}

      {showAddForm && (
        <div className="form-overlay">
          <form className="booking-form" onSubmit={handleAddUser}>
            <h2>Add New User</h2>
            <label>
              Name:
              <input
                type="text"
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </label>
            <AvatarSelector 
              avatar={newUser.avatar} 
              setAvatar={(avatar) => setNewUser({...newUser, avatar})} 
            />
            <div className="form-actions">
              <button type="submit">Add User</button>
              <button type="button" onClick={handleCancelAdd}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        {users.length === 0 ? (
          <p>No users found. Add your first user!</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="user-card">
              {editingUser && editingUser._id === user._id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <div className="user-avatar">
                    <AvatarSelector 
                      avatar={editingUser.avatar} 
                      setAvatar={(avatar) => setEditingUser({...editingUser, avatar})} 
                      size={50}
                      showTitle={false}
                    />
                  </div>
                  <div className="user-details">
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      required
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={editingUser.isActive}
                        onChange={e => setEditingUser({...editingUser, isActive: e.target.checked})}
                      />
                      Active
                    </label>
                  </div>
                  <div className="user-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="user-avatar">
                    <AvatarSelector 
                      avatar={user.avatar} 
                      setAvatar={() => {}} 
                      readOnly={true}
                      size={50}
                      showTitle={false}
                    />
                  </div>
                  <div className="user-details">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <small>Created: {new Date(user.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="user-actions">
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="btn-danger">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 