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
  SimpleGrid,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { api } from '../services/api';

export default function CalendarView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [groupedBookings, setGroupedBookings] = useState({
    past: [],
    future: [],
    today: []
  });

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
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      groupBookings();
    }
  }, [bookings]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
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

  const groupBookings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const grouped = {
      past: [],
      future: [],
      today: []
    };

    bookings.forEach(booking => {
      const bookingDate = new Date(booking.date);
      const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
      
      if (bookingDateOnly < today) {
        grouped.past.push(booking);
      } else if (bookingDateOnly.getTime() === today.getTime()) {
        grouped.today.push(booking);
      } else {
        grouped.future.push(booking);
      }
    });

    // Sort past bookings by date (newest first)
    grouped.past.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Sort future bookings by date (oldest first)
    grouped.future.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Sort today's bookings by time
    grouped.today.sort((a, b) => new Date(a.date) - new Date(b.date));

    setGroupedBookings(grouped);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const getBookingsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateString);
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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} bg="gray.50" minH="80px" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayBookings = getBookingsForDate(date);
      const hasBookings = dayBookings.length > 0;
      
      days.push(
        <Box
          key={day}
          minH="80px"
          p={2}
          border="1px"
          borderColor="gray.200"
          cursor="pointer"
          bg={isToday(date) ? "blue.50" : isSelected(date) ? "blue.100" : "white"}
          _hover={{ bg: "gray.50" }}
          onClick={() => setSelectedDate(date)}
          position="relative"
        >
          <Text
            fontWeight={isToday(date) ? "bold" : "normal"}
            color={isToday(date) ? "blue.600" : "gray.700"}
          >
            {day}
          </Text>
          {hasBookings && (
            <Badge
              position="absolute"
              top={1}
              right={1}
              colorScheme="blue"
              size="sm"
            >
              {dayBookings.length}
            </Badge>
          )}
        </Box>
      );
    }

    return days;
  };

  const renderBookingList = (bookings, title, colorScheme) => (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md" color={`${colorScheme}.600`}>
          {title} ({bookings.length})
        </Heading>
      </CardHeader>
      <CardBody>
        {bookings.length === 0 ? (
          <Text color="gray.600" textAlign="center">
            No {title.toLowerCase()} bookings
          </Text>
        ) : (
          <Grid templateColumns={gridTemplateColumns} gap={4}>
            {bookings.map((booking) => (
              <Card key={booking._id} variant="outline" _hover={{ shadow: "md" }}>
                <CardHeader pb={2}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading size="sm">{booking.machine}</Heading>
                      <Badge colorScheme={getStatusColor(booking.status)} variant="subtle">
                        {booking.status}
                      </Badge>
                    </VStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={2} align="stretch">
                    <Box>
                      <Text fontWeight="bold" color="gray.700" fontSize="sm">Date:</Text>
                      <Text color="gray.600" fontSize="sm">{new Date(booking.date).toLocaleDateString()}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="gray.700" fontSize="sm">Time:</Text>
                      <Text color="gray.600" fontSize="sm">{new Date(booking.date).toLocaleTimeString()}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="gray.700" fontSize="sm">Booked on:</Text>
                      <Text color="gray.600" fontSize="sm">{new Date(booking.createdAt).toLocaleDateString()}</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </CardBody>
    </Card>
  );

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">Loading calendar...</Text>
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
            📅 Booking Calendar
          </Heading>
          <Card>
            <CardBody>
              <Text textAlign="center" color="gray.600">
                Please select a user to view the calendar.
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
            📅 Booking Calendar
          </Heading>
          <Text color="gray.600" fontSize="lg">
            View and manage your bookings in calendar or list format
          </Text>
        </Box>

        <HStack spacing={4} justify="space-between" wrap="wrap">
          <HStack spacing={2}>
            <Button
              colorScheme={viewMode === 'calendar' ? 'blue' : 'gray'}
              variant={viewMode === 'calendar' ? 'solid' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              Calendar View
            </Button>
            <Button
              colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
              variant={viewMode === 'list' ? 'solid' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
          </HStack>
          <Button as="a" href="/" colorScheme="gray" variant="outline" leftIcon={<span>←</span>}>
            Back to Booking
          </Button>
        </HStack>

        {viewMode === 'calendar' ? (
          <VStack spacing={6} align="stretch">
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <HStack justify="space-between" w="100%">
                    <IconButton
                      icon={<ChevronLeftIcon />}
                      onClick={() => navigateMonth(-1)}
                      aria-label="Previous month"
                      variant="outline"
                    />
                    <Heading size="md">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Heading>
                    <IconButton
                      icon={<ChevronRightIcon />}
                      onClick={() => navigateMonth(1)}
                      aria-label="Next month"
                      variant="outline"
                    />
                  </HStack>

                  <SimpleGrid columns={7} spacing={0} w="100%">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <Box key={day} p={2} textAlign="center" fontWeight="bold" bg="gray.100">
                        {day}
                      </Box>
                    ))}
                    {renderCalendar()}
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader>
                  <Heading size="md">Bookings for {selectedDate.toLocaleDateString()}</Heading>
                </CardHeader>
                <CardBody>
                  {getBookingsForDate(selectedDate).length === 0 ? (
                    <Text color="gray.600" textAlign="center">
                      No bookings for this date
                    </Text>
                  ) : (
                    <Grid templateColumns={gridTemplateColumns} gap={4}>
                      {getBookingsForDate(selectedDate).map((booking) => (
                        <Card key={booking._id} variant="outline" _hover={{ shadow: "md" }}>
                          <CardHeader pb={2}>
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1}>
                                <Heading size="sm">{booking.machine}</Heading>
                                <Badge colorScheme={getStatusColor(booking.status)} variant="subtle">
                                  {booking.status}
                                </Badge>
                              </VStack>
                            </HStack>
                          </CardHeader>
                          <CardBody pt={0}>
                            <VStack spacing={2} align="stretch">
                              <Box>
                                <Text fontWeight="bold" color="gray.700" fontSize="sm">Time:</Text>
                                <Text color="gray.600" fontSize="sm">{new Date(booking.date).toLocaleTimeString()}</Text>
                              </Box>
                              <Box>
                                <Text fontWeight="bold" color="gray.700" fontSize="sm">Status:</Text>
                                <Text color="gray.600" fontSize="sm">{booking.status}</Text>
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </Grid>
                  )}
                </CardBody>
              </Card>
            )}
          </VStack>
        ) : (
          <VStack spacing={6} align="stretch">
            {renderBookingList(groupedBookings.today, 'Today', 'green')}
            {renderBookingList(groupedBookings.future, 'Upcoming', 'blue')}
            {renderBookingList(groupedBookings.past, 'Past', 'gray')}
          </VStack>
        )}
      </VStack>
    </Container>
  );
} 