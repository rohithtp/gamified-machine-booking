import React from 'react';
import { Box, Flex, Text, Badge, VStack } from '@chakra-ui/react';
import AvatarSelector from './AvatarSelector';

export default function GamificationPanel({ points, badges, user }) {
  return (
    <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
      <Flex align="center" gap={4}>
        <Box>
          <AvatarSelector
            user={user}
            readOnly={true}
            size={60}
            showTitle={false}
          />
        </Box>
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">
            Points: <Text as="span" color="blue.500">{points}</Text>
          </Text>
          <Box>
            <Text fontWeight="bold" mb={1}>Badges:</Text>
            {badges.length > 0 ? (
              <Flex gap={2} flexWrap="wrap">
                {badges.map((badge, index) => (
                  <Badge key={index} colorScheme="green" variant="subtle">
                    {badge}
                  </Badge>
                ))}
              </Flex>
            ) : (
              <Text color="gray.500" fontSize="sm">None yet</Text>
            )}
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}