import React from 'react';
import { Box, Button, VStack, Heading, Text, HStack, SimpleGrid } from '@chakra-ui/react';

const RatingStage = ({ items, onRate, onFinish }) => {
  const handleRate = (id, scoreType, score) => {
    onRate(id, scoreType, score);
  };

  const allRated = items.every(item => item.contentScore !== null && item.timelinessScore !== null);

  return (
    <VStack spacing={8} align="stretch">
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {items.map((item) => (
          <Box key={item.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" mb={4} fontWeight="bold">{item.text}</Text>
            
            {/* 内容评分 */}
            <VStack align="stretch" spacing={2} mb={4}>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">内容评分</Text>
              <HStack spacing={2} justify="center">
                {[
                  { label: 'Excellent', value: 5, color: 'green' },
                  { label: 'Good', value: 4, color: 'blue' },
                  { label: 'Fair', value: 2, color: 'yellow' },
                  { label: 'Bad', value: 0, color: 'red' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    colorScheme={option.color}
                    variant={item.contentScore === option.value ? 'solid' : 'outline'}
                    onClick={() => handleRate(item.id, 'contentScore', option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* 时效评分 */}
            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">时效评分</Text>
              <HStack spacing={2} justify="center">
                {[
                  { label: 'Excellent', value: 5, color: 'green' },
                  { label: 'Good', value: 4, color: 'blue' },
                  { label: 'Fair', value: 2, color: 'yellow' },
                  { label: 'Bad', value: 0, color: 'red' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    colorScheme={option.color}
                    variant={item.timelinessScore === option.value ? 'solid' : 'outline'}
                    onClick={() => handleRate(item.id, 'timelinessScore', option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Button colorScheme="green" size="lg" onClick={onFinish} isDisabled={!allRated}>
        显示结果
      </Button>
    </VStack>
  );
};

export default RatingStage;
