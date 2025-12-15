import React, { useMemo } from 'react';
import { Box, Button, VStack, Heading, Text, HStack, Divider, Badge, useToast, IconButton } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { calculateNDCG } from './ndcgCalculator';

const ResultStage = ({ items, onReset }) => {
  const toast = useToast();
  const groupAItems = items.filter(item => item.group === 'A').sort((a, b) => a.originalIndex - b.originalIndex);
  const groupBItems = items.filter(item => item.group === 'B').sort((a, b) => a.originalIndex - b.originalIndex);

  const calculateAverage = (groupItems, scoreType) => {
    if (groupItems.length === 0) return 0;
    const sum = groupItems.reduce((acc, item) => acc + (item[scoreType] || 0), 0);
    return (sum / groupItems.length).toFixed(2);
  };

  const avgAContent = calculateAverage(groupAItems, 'contentScore');
  const avgATimeliness = calculateAverage(groupAItems, 'timelinessScore');
  const avgBContent = calculateAverage(groupBItems, 'contentScore');
  const avgBTimeliness = calculateAverage(groupBItems, 'timelinessScore');

  // 计算NDCG
  const ndcgResults = useMemo(() => {
    const ownContentScores = groupAItems.map(item => item.contentScore || 0);
    const ownTimeScores = groupAItems.map(item => item.timelinessScore || 0);
    const targetContentScores = groupBItems.map(item => item.contentScore || 0);
    const targetTimeScores = groupBItems.map(item => item.timelinessScore || 0);
    
    return calculateNDCG(ownContentScores, ownTimeScores, targetContentScores, targetTimeScores);
  }, [groupAItems, groupBItems]);

  const getRatingLabel = (score) => {
    switch(score) {
      case 5: return { label: 'Excellent', color: 'green' };
      case 4: return { label: 'Good', color: 'blue' };
      case 2: return { label: 'Fair', color: 'yellow' };
      case 0: return { label: 'Bad', color: 'red' };
      default: return { label: 'Unrated', color: 'gray' };
    }
  };

  const copyToClipboard = (groupItems, groupName) => {
    // 复制文本、内容标签和时效标签，不包含数字分数
    const text = groupItems.map(item => {
      const contentLabel = getRatingLabel(item.contentScore);
      const timelinessLabel = getRatingLabel(item.timelinessScore);
      return `${item.text}\t${contentLabel.label}\t${timelinessLabel.label}`;
    }).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${groupName} 已复制`,
        description: '可以直接粘贴到 Excel 中',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }).catch(() => {
      toast({
        title: '复制失败',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  const renderGroup = (title, groupItems, avgContent, avgTimeliness) => (
    <Box flex="1" p={5} shadow="lg" borderWidth="1px" borderRadius="md" bg="gray.50">
      <HStack justify="space-between" mb={2}>
        <Heading size="md">{title}</Heading>
        <Button
          size="sm"
          leftIcon={<CopyIcon />}
          colorScheme="teal"
          onClick={() => copyToClipboard(groupItems, title)}
        >
          复制
        </Button>
      </HStack>
      <VStack spacing={3} align="stretch">
        {groupItems.map(item => {
          const contentLabel = getRatingLabel(item.contentScore);
          const timelinessLabel = getRatingLabel(item.timelinessScore);
          return (
            <Box key={item.id} p={3} bg="white" shadow="sm" borderRadius="md" borderWidth="1px">
              <VStack align="stretch" spacing={2}>
                <Text fontWeight="bold">{item.text}</Text>
                <HStack justify="space-between">
                  <HStack>
                    <Text fontSize="sm" color="gray.600">内容:</Text>
                    <Badge colorScheme={contentLabel.color} fontSize="0.9em">{contentLabel.label}</Badge>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" color="gray.600">时效:</Text>
                    <Badge colorScheme={timelinessLabel.color} fontSize="0.9em">{timelinessLabel.label}</Badge>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      {/* NDCG结果展示 */}
      <Box p={5} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
        <Heading size="md" mb={4} color="blue.700">NDCG Analysis Results</Heading>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontWeight="bold">内容 NDCG:</Text>
            <HStack spacing={4}>
              <Badge colorScheme="green" fontSize="md">query: {ndcgResults.ownContentNdcg}</Badge>
              <Badge colorScheme="purple" fontSize="md">榜单: {ndcgResults.targetContentNdcg}</Badge>
            </HStack>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="bold">时效 NDCG:</Text>
            <HStack spacing={4}>
              <Badge colorScheme="green" fontSize="md">query: {ndcgResults.ownTimeNdcg}</Badge>
              <Badge colorScheme="purple" fontSize="md">榜单: {ndcgResults.targetTimeNdcg}</Badge>
            </HStack>
          </HStack>
          <Divider />
          <HStack justify="space-between" fontSize="sm" color="gray.600">
            <Text>内容 DCG: A={ndcgResults.ownContentDcg}, B={ndcgResults.targetContentDcg}, IDCG={ndcgResults.contentIdcg}</Text>
          </HStack>
          <HStack justify="space-between" fontSize="sm" color="gray.600">
            <Text>时效 DCG: A={ndcgResults.ownTimeDcg}, B={ndcgResults.targetTimeDcg}, IDCG={ndcgResults.timeIdcg}</Text>
          </HStack>
        </VStack>
      </Box>

      <HStack spacing={8} align="start" flexWrap="wrap">
        {renderGroup("query", groupAItems, avgAContent, avgATimeliness)}
        {renderGroup("榜单", groupBItems, avgBContent, avgBTimeliness)}
      </HStack>

      <Button colorScheme="blue" size="lg" onClick={onReset}>
        重新开始
      </Button>
    </VStack>
  );
};

export default ResultStage;
