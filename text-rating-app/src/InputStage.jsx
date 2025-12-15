import React, { useState } from 'react';
import { Box, Button, Textarea, VStack, Heading, FormControl, FormLabel, HStack } from '@chakra-ui/react';

const InputStage = ({ onNext }) => {
  const [groupA, setGroupA] = useState('');
  const [groupB, setGroupB] = useState('');

  const handleNext = () => {
    if (groupA.trim() && groupB.trim()) {
      onNext(groupA, groupB);
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      <HStack spacing={8} align="start">
        <FormControl>
          <FormLabel>输入query文本(逗号分隔)</FormLabel>
          <Textarea
            value={groupA}
            onChange={(e) => setGroupA(e.target.value)}
            placeholder="Item 1, Item 2, Item 3..."
            minH="300px"
          />
        </FormControl>
        <FormControl>
          <FormLabel>输入榜单文本(逗号分隔)</FormLabel>
          <Textarea
            value={groupB}
            onChange={(e) => setGroupB(e.target.value)}
            placeholder="Item 1, Item 2, Item 3..."
            minH="300px"
          />
        </FormControl>
      </HStack>
      <Button colorScheme="blue" size="lg" onClick={handleNext} isDisabled={!groupA.trim() || !groupB.trim()}>
        洗牌并开始评分
      </Button>
    </VStack>
  );
};

export default InputStage;
