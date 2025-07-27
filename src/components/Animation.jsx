import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const confettiBurst = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.3) rotate(24deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default function Animation() {
  return (
    <VStack spacing={4} textAlign="center" animation={`${fadeIn} 2s`}>
      <Box 
        fontSize="4xl" 
        color="green.500"
        animation={`${confettiBurst} 1.5s infinite alternate`}
      >
        🎉
      </Box>
      <Text fontSize="xl" fontWeight="bold" color="green.500">
        Booking Successful!
      </Text>
    </VStack>
  );
}