import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BookingForm({ onBook }) {
  const [machine, setMachine] = useState('');
  const [date, setDate] = useState('');
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const machinesData = await api.getMachines();
      // Only show active machines for booking
      const activeMachines = machinesData.filter(machine => machine.isActive !== false);
      setMachines(activeMachines);
    } catch (err) {
      console.error('Failed to load machines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (machine && date) {
      onBook(machine, date);
      setMachine('');
      setDate('');
    }
  };

  if (loading) {
    return (
      <form className="booking-form">
        <h2>Book a Machine</h2>
        <div>Loading machines...</div>
      </form>
    );
  }

  if (machines.length === 0) {
    return (
      <form className="booking-form">
        <h2>Book a Machine</h2>
        <div className="no-machines-message">
          <p>No machines available for booking.</p>
          <div className="no-machines-actions">
            <a href="/systems" className="btn-primary">Go to System Management</a>
            <p className="help-text">Add machines in the Systems page</p>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Book a Machine</h2>
      <label>
        Machine:
        <select value={machine} onChange={e => setMachine(e.target.value)} required>
          <option value="">Select a machine</option>
          {machines.map(m => (
            <option key={m._id} value={m.name}>
              {m.name} ({m.type})
            </option>
          ))}
        </select>
      </label>
      <label>
        Date:
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          min={new Date().toISOString().split('T')[0]}
          required 
        />
      </label>
      <button type="submit">Book</button>
    </form>
  );
}