import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const machineTypes = [
  'manufacturing',
  'simulation',
  'electronics',
  'research',
  'testing',
  'prototyping',
  'analysis',
  'other'
];

export default function SystemsPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMachine, setEditingMachine] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMachine, setNewMachine] = useState({ 
    name: '', 
    type: 'manufacturing', 
    description: '', 
    location: '', 
    isActive: true 
  });

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const data = await api.getMachines();
      setMachines(data);
    } catch (err) {
      setError('Failed to load machines');
      console.error('Error loading machines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await api.deleteMachine(machineId);
        await loadMachines(); // Reload the list
      } catch (err) {
        setError('Failed to delete machine');
        console.error('Error deleting machine:', err);
      }
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateMachine(editingMachine._id, {
        name: editingMachine.name,
        type: editingMachine.type,
        description: editingMachine.description,
        location: editingMachine.location,
        isActive: editingMachine.isActive
      });
      setEditingMachine(null);
      await loadMachines(); // Reload the list
    } catch (err) {
      setError('Failed to update machine');
      console.error('Error updating machine:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingMachine(null);
  };

  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      await api.createMachine(newMachine);
      setNewMachine({ 
        name: '', 
        type: 'manufacturing', 
        description: '', 
        location: '', 
        isActive: true 
      });
      setShowAddForm(false);
      await loadMachines(); // Reload the list
    } catch (err) {
      setError('Failed to create machine');
      console.error('Error creating machine:', err);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewMachine({ 
      name: '', 
      type: 'manufacturing', 
      description: '', 
      location: '', 
      isActive: true 
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading machines...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="bookings-header">
        <h1>System Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Machine
        </button>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={loadMachines}>Retry</button>
        </div>
      )}

      {showAddForm && (
        <div className="form-overlay">
          <form className="booking-form" onSubmit={handleAddMachine}>
            <h2>Add New Machine</h2>
            <label>
              Name:
              <input
                type="text"
                value={newMachine.name}
                onChange={e => setNewMachine({...newMachine, name: e.target.value})}
                required
              />
            </label>
            <label>
              Type:
              <select
                value={newMachine.type}
                onChange={e => setNewMachine({...newMachine, type: e.target.value})}
                required
              >
                {machineTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Description:
              <textarea
                value={newMachine.description}
                onChange={e => setNewMachine({...newMachine, description: e.target.value})}
                rows="3"
                placeholder="Optional description of the machine"
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={newMachine.location}
                onChange={e => setNewMachine({...newMachine, location: e.target.value})}
                placeholder="e.g., Lab A, Room 101"
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={newMachine.isActive}
                onChange={e => setNewMachine({...newMachine, isActive: e.target.checked})}
              />
              Active
            </label>
            <div className="form-actions">
              <button type="submit">Add Machine</button>
              <button type="button" onClick={handleCancelAdd}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="machines-list">
        {machines.length === 0 ? (
          <p>No machines found. Add your first machine!</p>
        ) : (
          machines.map(machine => (
            <div key={machine._id} className="machine-card">
              {editingMachine && editingMachine._id === machine._id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <div className="machine-icon">
                    <span className="machine-type-icon">
                      {machine.type === 'manufacturing' ? '🏭' :
                       machine.type === 'simulation' ? '🎮' :
                       machine.type === 'electronics' ? '⚡' :
                       machine.type === 'research' ? '🔬' :
                       machine.type === 'testing' ? '🧪' :
                       machine.type === 'prototyping' ? '🔧' :
                       machine.type === 'analysis' ? '📊' : '⚙️'}
                    </span>
                  </div>
                  <div className="machine-details">
                    <input
                      type="text"
                      value={editingMachine.name}
                      onChange={e => setEditingMachine({...editingMachine, name: e.target.value})}
                      required
                    />
                    <select
                      value={editingMachine.type}
                      onChange={e => setEditingMachine({...editingMachine, type: e.target.value})}
                      required
                    >
                      {machineTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={editingMachine.description}
                      onChange={e => setEditingMachine({...editingMachine, description: e.target.value})}
                      rows="2"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editingMachine.location}
                      onChange={e => setEditingMachine({...editingMachine, location: e.target.value})}
                      placeholder="Location"
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={editingMachine.isActive}
                        onChange={e => setEditingMachine({...editingMachine, isActive: e.target.checked})}
                      />
                      Active
                    </label>
                  </div>
                  <div className="machine-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="machine-icon">
                    <span className="machine-type-icon">
                      {machine.type === 'manufacturing' ? '🏭' :
                       machine.type === 'simulation' ? '🎮' :
                       machine.type === 'electronics' ? '⚡' :
                       machine.type === 'research' ? '🔬' :
                       machine.type === 'testing' ? '🧪' :
                       machine.type === 'prototyping' ? '🔧' :
                       machine.type === 'analysis' ? '📊' : '⚙️'}
                    </span>
                  </div>
                  <div className="machine-details">
                    <h3>{machine.name}</h3>
                    <p className="machine-type">{machine.type.charAt(0).toUpperCase() + machine.type.slice(1)}</p>
                    {machine.description && <p className="machine-description">{machine.description}</p>}
                    {machine.location && <p className="machine-location">📍 {machine.location}</p>}
                    <span className={`status ${machine.isActive ? 'active' : 'inactive'}`}>
                      {machine.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <small>Created: {new Date(machine.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="machine-actions">
                    <button onClick={() => handleEdit(machine)}>Edit</button>
                    <button onClick={() => handleDelete(machine._id)} className="btn-danger">Delete</button>
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