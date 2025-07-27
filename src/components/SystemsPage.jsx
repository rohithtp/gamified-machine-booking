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
  Checkbox,
  useDisclosure
} from '@chakra-ui/react';
import { api } from '../services/api';

// Smart icon mapping based on keywords in the type
const getMachineIcon = (type) => {
  if (!type) return '⚙️';
  
  const lowerType = type.toLowerCase();
  
  // Manufacturing related
  if (lowerType.includes('manufactur') || lowerType.includes('factory') || lowerType.includes('production')) return '🏭';
  
  // Simulation and gaming
  if (lowerType.includes('simulat') || lowerType.includes('game') || lowerType.includes('virtual')) return '🎮';
  
  // Electronics and electrical
  if (lowerType.includes('electr') || lowerType.includes('circuit') || lowerType.includes('power')) return '⚡';
  
  // Research and science
  if (lowerType.includes('research') || lowerType.includes('science') || lowerType.includes('lab')) return '🔬';
  
  // Testing and quality
  if (lowerType.includes('test') || lowerType.includes('quality') || lowerType.includes('inspect')) return '🧪';
  
  // Prototyping and tools
  if (lowerType.includes('prototyp') || lowerType.includes('tool') || lowerType.includes('build')) return '🔧';
  
  // Analysis and data
  if (lowerType.includes('analys') || lowerType.includes('data') || lowerType.includes('compute')) return '📊';
  
  // 3D printing and additive manufacturing
  if (lowerType.includes('3d') || lowerType.includes('print') || lowerType.includes('additive')) return '🖨️';
  
  // Robotics and automation
  if (lowerType.includes('robot') || lowerType.includes('automation') || lowerType.includes('control')) return '🤖';
  
  // Medical and healthcare
  if (lowerType.includes('medical') || lowerType.includes('health') || lowerType.includes('bio')) return '🏥';
  
  // Chemical and materials
  if (lowerType.includes('chemical') || lowerType.includes('material') || lowerType.includes('polymer')) return '🧪';
  
  // Default icon
  return '⚙️';
};

// Common machine type suggestions
const getMachineTypeSuggestions = (input) => {
  if (!input || input.length < 2) return [];
  
  const suggestions = [
    '3D Printer',
    'CNC Machine',
    'Laser Cutter',
    '3D Scanner',
    'Drill Press',
    'Band Saw',
    'Milling Machine',
    'Lathe',
    'Welding Machine',
    'Plasma Cutter',
    'Water Jet Cutter',
    'Electronics Workstation',
    'Microscope',
    'Spectrometer',
    'Oscilloscope',
    'Power Supply',
    'Function Generator',
    'Multimeter',
    'Soldering Station',
    'PCB Printer',
    'Robot Arm',
    'Conveyor Belt',
    'Assembly Line',
    'Quality Control Station',
    'Testing Chamber',
    'Environmental Chamber',
    'Vibration Table',
    'Impact Tester',
    'Tensile Tester',
    'Compression Tester',
    'Microscope',
    'Centrifuge',
    'Incubator',
    'Autoclave',
    'Fume Hood',
    'Chemical Reactor',
    'Mixer',
    'Extruder',
    'Injection Molder',
    'Vacuum Former',
    'Heat Press',
    'Embroidery Machine',
    'Sewing Machine',
    'Textile Printer',
    'Wood Router',
    'Table Saw',
    'Planer',
    'Jointer',
    'Sander',
    'Grinder',
    'Polisher'
  ];
  
  const lowerInput = input.toLowerCase();
  return suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(lowerInput)
  ).slice(0, 5); // Limit to 5 suggestions
};

export default function SystemsPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMachine, setEditingMachine] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMachine, setNewMachine] = useState({ 
    name: '', 
    type: '', 
    description: '', 
    location: '', 
    isActive: true 
  });
  const [typeSuggestions, setTypeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editTypeSuggestions, setEditTypeSuggestions] = useState([]);
  const [showEditSuggestions, setShowEditSuggestions] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const containerMaxW = useBreakpointValue({ base: "100%", md: "1200px", lg: "1400px" });
  const gridTemplateColumns = useBreakpointValue({ 
    base: "1fr", 
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
    xl: "repeat(auto-fit, minmax(350px, 1fr))"
  });

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const data = await api.getMachines();
      setMachines(data);
    } catch (err) {
      setError('Failed to load machines');
      console.error('Error loading machines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await api.deleteMachine(machineId);
        await loadMachines(); // Reload the list
      } catch (err) {
        setError('Failed to delete machine');
        console.error('Error deleting machine:', err);
      }
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await api.updateMachine(editingMachine._id, {
        name: editingMachine.name,
        type: editingMachine.type,
        description: editingMachine.description,
        location: editingMachine.location,
        isActive: editingMachine.isActive
      });
      setEditingMachine(null);
      onClose();
      await loadMachines(); // Reload the list
    } catch (err) {
      setError('Failed to update machine');
      console.error('Error updating machine:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingMachine(null);
    onClose();
    setEditTypeSuggestions([]);
    setShowEditSuggestions(false);
  };

  const handleAddMachine = async () => {
    // Validate required fields
    if (!newMachine.name.trim()) {
      setError('Machine name is required');
      return;
    }
    if (!newMachine.type.trim()) {
      setError('Machine type is required');
      return;
    }
    
    try {
      await api.createMachine(newMachine);
      setNewMachine({ 
        name: '', 
        type: '', 
        description: '', 
        location: '', 
        isActive: true 
      });
      setShowAddForm(false);
      setError(null); // Clear any previous errors
      await loadMachines(); // Reload the list
    } catch (err) {
      setError('Failed to create machine');
      console.error('Error creating machine:', err);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewMachine({ 
      name: '', 
      type: '', 
      description: '', 
      location: '', 
      isActive: true 
    });
    setError(null); // Clear any errors
    setTypeSuggestions([]);
    setShowSuggestions(false);
  };

  const handleTypeChange = (value) => {
    setNewMachine({...newMachine, type: value});
    const suggestions = getMachineTypeSuggestions(value);
    setTypeSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.length >= 2);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMachine({...newMachine, type: suggestion});
    setTypeSuggestions([]);
    setShowSuggestions(false);
  };

  const handleEditTypeChange = (value) => {
    setEditingMachine({...editingMachine, type: value});
    const suggestions = getMachineTypeSuggestions(value);
    setEditTypeSuggestions(suggestions);
    setShowEditSuggestions(suggestions.length > 0 && value.length >= 2);
  };

  const handleEditSuggestionClick = (suggestion) => {
    setEditingMachine({...editingMachine, type: suggestion});
    setEditTypeSuggestions([]);
    setShowEditSuggestions(false);
  };

  if (loading) {
    return (
      <Container maxW={containerMaxW} py={10} px={4}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">Loading machines...</Text>
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
            ⚙️ System Management
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Manage available machines and their configurations
          </Text>
        </Box>

        <HStack justify="space-between" wrap="wrap">
          <Button 
            colorScheme="blue"
            leftIcon={<span>➕</span>}
            onClick={() => setShowAddForm(true)}
          >
            Add New Machine
          </Button>
        </HStack>

        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
            <Button ml={4} colorScheme="red" onClick={loadMachines}>
              Retry
            </Button>
          </Alert>
        )}

        {showAddForm && (
          <Modal isOpen={showAddForm} onClose={handleCancelAdd} size="md">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Machine</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={newMachine.name}
                      onChange={e => setNewMachine({...newMachine, name: e.target.value})}
                      placeholder="Enter machine name"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Box position="relative">
                      <Input
                        type="text"
                        value={newMachine.type}
                        onChange={e => handleTypeChange(e.target.value)}
                        onFocus={() => setShowSuggestions(typeSuggestions.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="e.g., 3D Printer, CNC Machine, Laser Cutter"
                      />
                      {showSuggestions && (
                        <Box
                          position="absolute"
                          top="100%"
                          left={0}
                          right={0}
                          bg="white"
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="md"
                          boxShadow="lg"
                          zIndex={10}
                          maxH="200px"
                          overflowY="auto"
                        >
                          {typeSuggestions.map((suggestion, index) => (
                            <Box
                              key={index}
                              px={3}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: "gray.50" }}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <Text fontSize="sm">{suggestion}</Text>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Enter any machine type. Icons will be automatically assigned based on keywords.
                    </Text>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={newMachine.description}
                      onChange={e => setNewMachine({...newMachine, description: e.target.value})}
                      placeholder="Optional description of the machine"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      value={newMachine.location}
                      onChange={e => setNewMachine({...newMachine, location: e.target.value})}
                      placeholder="e.g., Lab A, Room 101"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <Checkbox
                      isChecked={newMachine.isActive}
                      onChange={e => setNewMachine({...newMachine, isActive: e.target.checked})}
                    >
                      Active
                    </Checkbox>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleCancelAdd}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleAddMachine}>
                  Add Machine
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {machines.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={12}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.600">
                  No machines found. Add your first machine!
                </Text>
                <Button 
                  colorScheme="blue" 
                  size="lg"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Machine
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={gridTemplateColumns} gap={6}>
            {machines.map(machine => (
              <Card key={machine._id} variant="outline" _hover={{ shadow: "md" }}>
                <CardBody>
                  <HStack spacing={4} align="start">
                    <Box 
                      flexShrink={0}
                      w="60px"
                      h="60px"
                      bg="gray.50"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="2xl"
                    >
                      {getMachineIcon(machine.type)}
                    </Box>
                    
                    <VStack spacing={2} align="start" flex={1}>
                      <Box>
                        <Heading size="md">{machine.name}</Heading>
                        <Badge colorScheme="blue" variant="subtle" mt={1}>
                          {machine.type || 'Unspecified'}
                        </Badge>
                      </Box>
                      
                      {machine.description && (
                        <Text color="gray.600" fontSize="sm" lineHeight="1.4">
                          {machine.description}
                        </Text>
                      )}
                      
                      {machine.location && (
                        <Text color="gray.600" fontSize="sm">
                          📍 {machine.location}
                        </Text>
                      )}
                      
                      <HStack spacing={2}>
                        <Badge colorScheme={machine.isActive ? "green" : "red"} variant="subtle">
                          {machine.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          Created: {new Date(machine.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                    </VStack>
                    
                    <VStack spacing={2} align="end">
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        variant="outline"
                        onClick={() => handleEdit(machine)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        variant="outline"
                        onClick={() => handleDelete(machine._id)}
                      >
                        Delete
                      </Button>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Machine</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {editingMachine && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={editingMachine.name}
                      onChange={e => setEditingMachine({...editingMachine, name: e.target.value})}
                      placeholder="Enter machine name"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Box position="relative">
                      <Input
                        type="text"
                        value={editingMachine.type}
                        onChange={e => handleEditTypeChange(e.target.value)}
                        onFocus={() => setShowEditSuggestions(editTypeSuggestions.length > 0)}
                        onBlur={() => setTimeout(() => setShowEditSuggestions(false), 200)}
                        placeholder="e.g., 3D Printer, CNC Machine, Laser Cutter"
                      />
                      {showEditSuggestions && (
                        <Box
                          position="absolute"
                          top="100%"
                          left={0}
                          right={0}
                          bg="white"
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="md"
                          boxShadow="lg"
                          zIndex={10}
                          maxH="200px"
                          overflowY="auto"
                        >
                          {editTypeSuggestions.map((suggestion, index) => (
                            <Box
                              key={index}
                              px={3}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: "gray.50" }}
                              onClick={() => handleEditSuggestionClick(suggestion)}
                            >
                              <Text fontSize="sm">{suggestion}</Text>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Enter any machine type. Icons will be automatically assigned based on keywords.
                    </Text>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={editingMachine.description}
                      onChange={e => setEditingMachine({...editingMachine, description: e.target.value})}
                      placeholder="Description"
                      rows={2}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      value={editingMachine.location}
                      onChange={e => setEditingMachine({...editingMachine, location: e.target.value})}
                      placeholder="Location"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <Checkbox
                      isChecked={editingMachine.isActive}
                      onChange={e => setEditingMachine({...editingMachine, isActive: e.target.checked})}
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