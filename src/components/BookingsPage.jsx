import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  HStack,
  Text, 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Badge,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';
import { api } from '../services/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [machines, setMachines] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const containerMaxW = useBreakpointValue({ base: "100%", md: "1200px", lg: "1400px" });
  const gridTemplateColumns = useBreakpointValue({ 
    base: "1fr", 
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
    xl: "repeat(auto-fit, minmax(350px, 1fr))"
  });

  useEffect(() => {
    const userId = api.getCurrentUser();
    if (userId) {
      loadBookings();
      loadMachines();
    } else {
      setLoading(false);
    }
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      // Filter bookings for current user
      const userId = api.getCurrentUser();
      const userBookings = userId ? data.filter(booking => booking.userId === userId) : [];
      setBookings(userBookings);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMachines = async () => {
    try {
      const data = await api.getMachines();
      setMachines(data);
    } catch (err) {
      console.error('Error loading machines:', err);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.deleteBooking(bookingId);
        await loadBookings(); // Reload the list
      } catch (err) {
        setError('Failed to delete booking');
        console.error('Error deleting booking:', err);
      }
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await api.updateBooking(editingBooking._id, {
        machine: editingBooking.machine,
        date: editingBooking.date,
        status: editingBooking.status
      });
      setEditingBooking(null);
      onClose();
      await loadBookings(); // Reload the list
    } catch (err) {
      setError('Failed to update booking');
      console.error('Error updating booking:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">Loading bookings...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  const currentUserId = api.getCurrentUser();
  if (!currentUserId) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <VStack spacing={6} align="stretch">
          <Heading size="xl" textAlign="center" color="blue.600">
            📋 My Bookings
          </Heading>
          <Card>
            <CardBody>
              <Text textAlign="center" color="gray.600">
                Please select a user to view bookings.
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
          <Button ml={4} colorScheme="red" onClick={loadBookings}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW={containerMaxW} py={8} px={4}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" color="blue.600" mb={2}>
            📋 Bookings Management
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Manage your machine bookings and track their status
          </Text>
        </Box>

        <HStack spacing={4} justify="space-between" wrap="wrap">
          <HStack spacing={4}>
            <Button as="a" href="/calendar" colorScheme="blue" variant="outline" leftIcon={<span>📅</span>}>
              Calendar View
            </Button>
            <Button as="a" href="/" colorScheme="gray" variant="outline" leftIcon={<span>←</span>}>
              Back to Booking
            </Button>
          </HStack>
        </HStack>

        {bookings.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={12}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.600">
                  No bookings found. Create your first booking!
                </Text>
                <Button as="a" href="/" colorScheme="blue" size="lg">
                  Make a Booking
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={gridTemplateColumns} gap={6}>
            {bookings.map((booking) => (
              <Card key={booking._id} variant="outline" _hover={{ shadow: "md" }}>
                <CardHeader pb={2}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{booking.machine}</Heading>
                      <Badge colorScheme={getStatusColor(booking.status)} variant="subtle">
                        {booking.status}
                      </Badge>
                    </VStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontWeight="bold" color="gray.700">Date:</Text>
                      <Text color="gray.600">{formatDate(booking.date)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="gray.700">Booked on:</Text>
                      <Text color="gray.600">{formatDateTime(booking.createdAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="gray.700">User ID:</Text>
                      <Text color="gray.600">{booking.userId}</Text>
                    </Box>
                    
                    <HStack spacing={2} pt={2}>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        variant="outline"
                        onClick={() => handleEdit(booking)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        variant="outline"
                        onClick={() => handleDelete(booking._id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Booking</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {editingBooking && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Machine</FormLabel>
                    <Select
                      value={editingBooking.machine}
                      onChange={(e) => setEditingBooking({
                        ...editingBooking,
                        machine: e.target.value
                      })}
                    >
                      {machines.map(m => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.type})
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      value={editingBooking.date}
                      onChange={(e) => setEditingBooking({
                        ...editingBooking,
                        date: e.target.value
                      })}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={editingBooking.status}
                      onChange={(e) => setEditingBooking({
                        ...editingBooking,
                        status: e.target.value
                      })}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleUpdate}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
} 