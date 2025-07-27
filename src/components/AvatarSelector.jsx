import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, HStack, Button, useToast } from '@chakra-ui/react';
import Avatar from 'boring-avatars';
import { api } from '../services/api';

const avatarVariants = ['beam', 'sunset', 'ring', 'pixel', 'bauhaus'];
const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

export default function AvatarSelector({ 
  user, 
  onAvatarChange, 
  readOnly = false, 
  size = 40, 
  showTitle = true,
  showRandomize = true
}) {
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || 'beam');
  const toast = useToast();

  useEffect(() => {
    setCurrentAvatar(user?.avatar || 'beam');
  }, [user?.avatar]);

  const generateRandomAvatar = async () => {
    try {
      const { avatar } = await api.getRandomAvatar();
      setCurrentAvatar(avatar);
      if (onAvatarChange) {
        onAvatarChange(avatar);
      }
      toast({
        title: "Avatar Randomized!",
        description: `Your new avatar is: ${avatar}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate random avatar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // If read-only, show only the selected avatar
  if (readOnly) {
    return (
      <Box>
        <Avatar
          size={size}
          name={currentAvatar}
          variant={currentAvatar}
          colors={colors}
        />
      </Box>
    );
  }

  // Show simplified interface with randomize button
  return (
    <VStack spacing={4} align="stretch">
      {showTitle && (
        <Text fontWeight="medium" color="gray.700" fontSize="sm">
          Your Avatar:
        </Text>
      )}
      
      <Box textAlign="center">
        <Box
          p={2}
          borderRadius="full"
          border="3px"
          borderColor="blue.500"
          display="inline-block"
          mb={3}
        >
          <Avatar
            size={size * 1.5}
            name={currentAvatar}
            variant={currentAvatar}
            colors={colors}
          />
        </Box>
        
        <Text fontSize="sm" color="gray.600" mb={2}>
          Current: {currentAvatar}
        </Text>
      </Box>

      {showRandomize && (
        <VStack spacing={3}>
          <Button
            colorScheme="purple"
            size="sm"
            onClick={generateRandomAvatar}
            leftIcon={<span>🎲</span>}
            width="full"
          >
            Randomize Avatar
          </Button>
          
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Click to get a random avatar style
          </Text>
        </VStack>
      )}

      {/* Optional: Show all variants for manual selection */}
      {!showRandomize && (
        <VStack spacing={2}>
          <Text fontSize="sm" color="gray.600">
            Or choose manually:
          </Text>
          <HStack spacing={2} justify="center" flexWrap="wrap">
            {avatarVariants.map(variant => (
              <Box
                key={variant}
                p={1}
                borderRadius="full"
                border="2px"
                borderColor={currentAvatar === variant ? "blue.500" : "transparent"}
                cursor="pointer"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s"
                onClick={() => {
                  setCurrentAvatar(variant);
                  onAvatarChange && onAvatarChange(variant);
                }}
              >
                <Avatar
                  size={size * 0.8}
                  name={variant}
                  variant={variant}
                  colors={colors}
                />
              </Box>
            ))}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}