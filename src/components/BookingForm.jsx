import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, FormControl, FormLabel, Select, Input, Button, Text, Link as ChakraLink, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
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
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Heading size="md">Book a Machine</Heading>
          <Box textAlign="center">
            <Spinner size="md" color="blue.500" />
            <Text mt={2}>Loading machines...</Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (machines.length === 0) {
    return (
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Heading size="md">Book a Machine</Heading>
          <Box textAlign="center">
            <Text mb={4}>No machines available for booking.</Text>
            <VStack spacing={3}>
              <ChakraLink as={Link} to="/systems" color="blue.500" fontWeight="medium">
                Go to System Management
              </ChakraLink>
              <Text fontSize="sm" color="gray.500" fontStyle="italic">
                Add machines in the Systems page
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Book a Machine</Heading>
        
        <FormControl isRequired>
          <FormLabel>Machine:</FormLabel>
          <Select 
            value={machine} 
            onChange={e => setMachine(e.target.value)}
            placeholder="Select a machine"
          >
            {machines.map(m => (
              <option key={m._id} value={m.name}>
                {m.name} ({m.type})
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date:</FormLabel>
          <Input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            min={new Date().toISOString().split('T')[0]}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" size="lg">
          Book
        </Button>
      </VStack>
    </Box>
  );
}