import React, { useState } from 'react';

export default function BookingForm({ onBook }) {
  const [machine, setMachine] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (machine && date) {
      onBook();
      setMachine('');
      setDate('');
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Book a Machine</h2>
      <label>
        Machine Name:
        <input value={machine} onChange={e => setMachine(e.target.value)} required />
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </label>
      <button type="submit">Book</button>
    </form>
  );
}