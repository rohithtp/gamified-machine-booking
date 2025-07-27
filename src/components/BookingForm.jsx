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
      setMachines(machinesData);
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

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Book a Machine</h2>
      <label>
        Machine:
        <select value={machine} onChange={e => setMachine(e.target.value)} required>
          <option value="">Select a machine</option>
          {machines.map(m => (
            <option key={m.id} value={m.name}>
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