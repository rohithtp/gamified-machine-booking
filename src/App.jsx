import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import BookingPage from './components/BookingPage';
import BookingsPage from './components/BookingsPage';
import CalendarView from './components/CalendarView';
import UsersPage from './components/UsersPage';
import SystemsPage from './components/SystemsPage';

// Custom theme for better aesthetics
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

function Navigation() {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      bg={bg} 
      boxShadow="sm" 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky" 
      top={0} 
      zIndex={1000}
    >
      <Flex maxW="1400px" mx="auto" px={5} justify="space-between" align="center" h="70px">
        <Link to="/">
          <Flex align="center" gap={2}>
            <Text fontSize="2xl" fontWeight="bold" color="brand.500">
              🎮
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="brand.500">
              Gamified Booking
            </Text>
          </Flex>
        </Link>
        <Flex gap={2} wrap="wrap">
          <Link to="/">
            <Button variant="ghost" _hover={{ bg: 'gray.50' }} size="md">
              📅 Book Machine
            </Button>
          </Link>
          <Link to="/bookings">
            <Button variant="ghost" _hover={{ bg: 'gray.50' }} size="md">
              📋 My Bookings
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="ghost" _hover={{ bg: 'gray.50' }} size="md">
              🗓️ Calendar
            </Button>
          </Link>
          <Link to="/users">
            <Button variant="ghost" _hover={{ bg: 'gray.50' }} size="md">
              👥 Users
            </Button>
          </Link>
          <Link to="/systems">
            <Button variant="ghost" _hover={{ bg: 'gray.50' }} size="md">
              ⚙️ Systems
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Navigation />
          <Box as="main" py={4}>
            <Routes>
              <Route path="/" element={<BookingPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/systems" element={<SystemsPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}