import React, { useState } from 'react';
import { Box, Container, VStack, Heading, useToast } from '@chakra-ui/react';
import InputStage from './InputStage';
import RatingStage from './RatingStage';
import ResultStage from './ResultStage';

function App() {
  const [stage, setStage] = useState('input'); // input, rating, result
  const [items, setItems] = useState([]);
  const toast = useToast();

  const handleInputNext = (groupA, groupB) => {
    const processText = (text, group) => {
      return text.split(',')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((text, index) => ({
          id: Math.random().toString(36).substr(2, 9),
          text,
          group,
          originalIndex: index, // Track original position
          contentScore: null, // 内容评分
          timelinessScore: null // 时效评分
        }));
    };

    const itemsA = processText(groupA, 'A');
    const itemsB = processText(groupB, 'B');
    const allItems = [...itemsA, ...itemsB];

    if (allItems.length === 0) {
      toast({
        title: "No text entered",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Shuffle (Fisher-Yates)
    const shuffled = [...allItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
    setStage('rating');
  };

  const handleRate = (id, scoreType, score) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, [scoreType]: score } : item
    ));
  };

  const handleRatingFinish = () => {
    setStage('result');
  };

  const handleReset = () => {
    setItems([]);
    setStage('input');
  };

  return (
    <Box maxW="1024" minH="100vh" bg="gray.100" py={10} display="flex" justifyContent="center" alignItems="center">
      <Container maxW="90vw" bg="white" p={10} borderRadius="xl" shadow="xl">
        <VStack spacing={8}>
          <Heading color="teal.500">智能文件夹测评</Heading>
          
          <Box w="100%">
            {stage === 'input' && (
              <InputStage onNext={handleInputNext} />
            )}
            
            {stage === 'rating' && (
              <RatingStage 
                items={items} 
                onRate={handleRate} 
                onFinish={handleRatingFinish} 
              />
            )}
            
            {stage === 'result' && (
              <ResultStage 
                items={items} 
                onReset={handleReset} 
              />
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
