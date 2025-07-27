import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Flex, Alert, AlertIcon, AlertTitle, AlertDescription, Link as ChakraLink, Spinner, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
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
    return (
      <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
        <Center>
          <VStack spacing={3}>
            <Spinner size="md" color="blue.500" />
            <Text>Loading users...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
          <Button ml={4} colorScheme="red" onClick={loadUsers}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
        <VStack spacing={4} textAlign="center">
          <Heading size="md">No Users Available</Heading>
          <Text>You need to create users before you can make bookings.</Text>
          <VStack spacing={3}>
            <ChakraLink as={Link} to="/users" color="blue.500" fontWeight="medium">
              Go to User Management
            </ChakraLink>
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              Create your first user in the Users page
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Select User:</Heading>
        <VStack spacing={2}>
          {users.map(user => (
            <Box
              key={user._id}
              p={3}
              bg={selectedUserId === user._id ? "blue.50" : "white"}
              border="2px"
              borderColor={selectedUserId === user._id ? "blue.500" : "transparent"}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: selectedUserId === user._id ? "blue.50" : "gray.50" }}
              onClick={() => handleUserSelect(user._id)}
            >
              <Flex align="center" gap={3}>
                <AvatarSelector
                  user={user}
                  readOnly={true}
                  size={40}
                  showTitle={false}
                />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontWeight="medium" fontSize="sm">{user.name}</Text>
                  <Text fontSize="xs" color="gray.500">{user.email}</Text>
                </VStack>
                {selectedUserId === user._id && (
                  <Text color="blue.500" fontWeight="bold" fontSize="lg">✓</Text>
                )}
              </Flex>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
} 