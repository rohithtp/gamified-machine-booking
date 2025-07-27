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
  Checkbox,
  useDisclosure
} from '@chakra-ui/react';
import AvatarSelector from './AvatarSelector';
import { api } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', avatar: 'beam' });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const containerMaxW = useBreakpointValue({ base: "100%", md: "1200px", lg: "1400px" });
  const gridTemplateColumns = useBreakpointValue({ 
    base: "1fr", 
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
    xl: "repeat(auto-fit, minmax(350px, 1fr))"
  });

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

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId);
        await loadUsers(); // Reload the list
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await api.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        avatar: editingUser.avatar,
        isActive: editingUser.isActive
      });
      setEditingUser(null);
      onClose();
      await loadUsers(); // Reload the list
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    onClose();
  };

  const handleAddUser = async () => {
    try {
      await api.createUser(newUser);
      setNewUser({ name: '', email: '', avatar: 'beam' });
      setShowAddForm(false);
      await loadUsers(); // Reload the list
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewUser({ name: '', email: '', avatar: 'beam' });
  };

  if (loading) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">Loading users...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW={containerMaxW} py={8} px={4}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" color="blue.600" mb={2}>
            👥 User Management
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Manage user accounts and their profiles
          </Text>
        </Box>

        <HStack justify="space-between" wrap="wrap" spacing={3}>
          <Button 
            colorScheme="blue"
            leftIcon={<span>➕</span>}
            onClick={() => setShowAddForm(true)}
          >
            Add New User
          </Button>
          <Button 
            colorScheme="purple"
            leftIcon={<span>🎲</span>}
            onClick={async () => {
              try {
                const { avatar } = await api.getRandomAvatar();
                setNewUser({ ...newUser, avatar });
                setShowAddForm(true);
              } catch (error) {
                console.error('Failed to get random avatar:', error);
                setShowAddForm(true);
              }
            }}
          >
            Quick Add with Random Avatar
          </Button>
        </HStack>

        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
            <Button ml={4} colorScheme="red" onClick={loadUsers}>
              Retry
            </Button>
          </Alert>
        )}

        {showAddForm && (
          <Modal isOpen={showAddForm} onClose={handleCancelAdd} size="md">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter user name"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={e => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter user email"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Avatar</FormLabel>
                    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <AvatarSelector 
                        user={newUser}
                        onAvatarChange={(avatar) => setNewUser({...newUser, avatar})}
                        showRandomize={true}
                        showTitle={false}
                      />
                    </Box>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleCancelAdd}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleAddUser}>
                  Add User
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {users.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={12}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.600">
                  No users found. Add your first user!
                </Text>
                <Button 
                  colorScheme="blue" 
                  size="lg"
                  onClick={() => setShowAddForm(true)}
                >
                  Add User
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={gridTemplateColumns} gap={6}>
            {users.map(user => (
              <Card key={user._id} variant="outline" _hover={{ shadow: "md" }}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={3} align="center">
                      <Box flexShrink={0}>
                        <AvatarSelector 
                          user={user}
                          readOnly={true}
                          size={40}
                          showTitle={false}
                        />
                      </Box>
                      
                      <VStack spacing={1} align="start" flex={1}>
                        <Heading size="md" noOfLines={1}>{user.name}</Heading>
                        <Text color="gray.600" fontSize="sm" noOfLines={1}>{user.email}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={2} justify="space-between">
                      <HStack spacing={2}>
                        <Badge colorScheme={user.isActive ? "green" : "red"} variant="subtle">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                      
                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          colorScheme="blue" 
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="outline"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </Button>
                      </HStack>
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
            <ModalHeader>Edit User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {editingUser && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Avatar</FormLabel>
                    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <AvatarSelector 
                        user={editingUser}
                        onAvatarChange={(avatar) => setEditingUser({...editingUser, avatar})}
                        size={50}
                        showTitle={false}
                        showRandomize={true}
                      />
                    </Box>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={editingUser.name}
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      placeholder="Enter user name"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={editingUser.email}
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      placeholder="Enter user email"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <Checkbox
                      isChecked={editingUser.isActive}
                      onChange={e => setEditingUser({...editingUser, isActive: e.target.checked})}
                    >
                      Active
                    </Checkbox>
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