import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  HStack,
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  Button, 
  Spinner, 
  Center,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import BookingForm from './BookingForm';
import GamificationPanel from './GamificationPanel';
import AvatarSelector from './AvatarSelector';
import UserSelector from './UserSelector';
import Animation from './Animation';
import { api } from '../services/api';

export default function BookingPage() {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const containerMaxW = useBreakpointValue({ base: "100%", md: "1200px", lg: "1400px" });
  const gridTemplateColumns = useBreakpointValue({ 
    base: "1fr", 
    lg: "1fr 1fr",
    xl: "1fr 1fr 1fr" 
  });

  // Load user data on component mount
  useEffect(() => {
    const userId = api.getCurrentUser();
    if (userId) {
      loadUserData(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUserSelect = (userId) => {
    setCurrentUser(userId);
    loadUserData(userId);
  };

  const loadUserData = async (userId) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const [userData, gamificationData] = await Promise.all([
        api.getUser(userId),
        api.getUserGamification()
      ]);
      setCurrentUser(userData);
      setPoints(gamificationData.points);
      setBadges(gamificationData.badges);
    } catch (err) {
      console.error('Failed to load user data:', err);
      // Clear the invalid user ID and show user selector
      api.setCurrentUser(null);
      setError(null); // Don't show error, just let user select again
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (machine, date) => {
    try {
      await api.createBooking(machine, date);
      setShowAnimation(true);
      
      // Reload user data to get updated points and badges
      const userId = api.getCurrentUser();
      if (userId) {
        await loadUserData(userId);
      }
      
      setTimeout(() => setShowAnimation(false), 2000);
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking. Please try again.');
    }
  };

  const handleAvatarChange = async (newAvatar) => {
    try {
      await api.updateUserAvatar(newAvatar);
      // Update the current user object with new avatar
      setCurrentUser(prev => prev ? { ...prev, avatar: newAvatar } : null);
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setError('Failed to update avatar. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">Loading...</Text>
          </VStack>
        </Center>
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
          <Button ml={4} colorScheme="red" onClick={loadUserData}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  const currentUserId = api.getCurrentUser();
  if (!currentUserId) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" textAlign="center" color="blue.600">
            🎮 Gamified Machine Booking
          </Heading>
          <Card>
            <CardBody>
              <UserSelector onUserSelect={handleUserSelect} />
            </CardBody>
          </Card>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW={containerMaxW} py={8} px={4}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" color="blue.600" mb={2}>
            🎮 Gamified Machine Booking
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Book your favorite machines and earn rewards!
          </Text>
        </Box>

        <Grid templateColumns={gridTemplateColumns} gap={6}>
          {/* Left Column - User & Avatar Selection */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardHeader>
                  <Heading size="md">👤 User Selection</Heading>
                </CardHeader>
                <CardBody>
                  <UserSelector onUserSelect={handleUserSelect} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">🎭 Avatar Selection</Heading>
                </CardHeader>
                <CardBody>
                  <AvatarSelector 
                    user={currentUser} 
                    onAvatarChange={handleAvatarChange} 
                  />
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Center Column - Gamification & Booking */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardHeader>
                  <Heading size="md">🏆 Gamification</Heading>
                </CardHeader>
                <CardBody>
                  <GamificationPanel points={points} badges={badges} user={currentUser} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">📅 Book a Machine</Heading>
                </CardHeader>
                <CardBody>
                  <BookingForm onBook={handleBooking} />
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Right Column - Additional Info (on larger screens) */}
          <GridItem display={{ base: "none", xl: "block" }}>
            <Card>
              <CardHeader>
                <Heading size="md">ℹ️ Quick Info</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" color="blue.600">How it works:</Text>
                    <Text fontSize="sm" color="gray.600" mt={2}>
                      1. Select your user profile<br/>
                      2. Choose your avatar<br/>
                      3. Book available machines<br/>
                      4. Earn points and badges!
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="green.600">Current Status:</Text>
                    <Text fontSize="sm" color="gray.600" mt={2}>
                      Points: {points}<br/>
                      Badges: {badges.length}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {showAnimation && <Animation />}
      </VStack>
    </Container>
  );
} 