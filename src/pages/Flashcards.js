import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Container,
  useTheme
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Flip as FlipIcon,
  Shuffle as ShuffleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const flashcards = [
  // Databricks Lakehouse Platform
  {
    id: 1,
    category: "Databricks Lakehouse Platform",
    front: "What is a data lakehouse?",
    back: "A data lakehouse is a modern data architecture that combines the best features of data lakes and data warehouses. It provides the flexibility and cost-effectiveness of data lakes with the data management and ACID transaction support of data warehouses."
  },
  {
    id: 2,
    category: "Databricks Lakehouse Platform",
    front: "What are the key components of the Databricks Lakehouse Platform?",
    back: "1. Data Lakehouse: Combines data lake and warehouse capabilities\n2. Delta Lake: Open format storage layer\n3. Unity Catalog: Unified governance solution\n4. Databricks SQL: SQL analytics\n5. Databricks Workspace: Collaborative environment"
  },
  {
    id: 3,
    category: "Databricks Lakehouse Platform",
    front: "What are the main benefits of the Lakehouse architecture?",
    back: "1. Cost-effective storage with data lake\n2. ACID transactions for data reliability\n3. Schema enforcement and governance\n4. Support for diverse workloads (BI, ML, SQL)\n5. Direct access to source data\n6. Open format and standards"
  },

  // Delta Lake
  {
    id: 4,
    category: "Delta Lake",
    front: "What is Delta Lake?",
    back: "Delta Lake is an open format storage layer that delivers reliability, security, and performance for data lakes. It provides ACID transactions, scalable metadata handling, and unified streaming and batch data processing."
  },
  {
    id: 5,
    category: "Delta Lake",
    front: "What are the key features of Delta Lake?",
    back: "1. ACID Transactions\n2. Time Travel\n3. Schema Evolution\n4. Data Versioning\n5. Optimized Performance\n6. Data Quality Constraints"
  },
  {
    id: 6,
    category: "Delta Lake",
    front: "What is Time Travel in Delta Lake?",
    back: "Time Travel allows you to query historical versions of your data using timestamps or version numbers. This feature enables data versioning, rollback, and audit trails."
  },

  // Delta Live Tables
  {
    id: 7,
    category: "Delta Live Tables",
    front: "What is Delta Live Tables (DLT)?",
    back: "Delta Live Tables is a framework for building reliable, maintainable, and testable data processing pipelines. It provides declarative pipeline development, automatic data quality monitoring, and simplified pipeline operations."
  },
  {
    id: 8,
    category: "Delta Live Tables",
    front: "What are the key benefits of using Delta Live Tables?",
    back: "1. Declarative pipeline development\n2. Automatic data quality monitoring\n3. Simplified pipeline operations\n4. Built-in error handling\n5. Automatic scaling\n6. Pipeline visualization"
  },
  {
    id: 9,
    category: "Delta Live Tables",
    front: "What are expectations in DLT?",
    back: "Expectations in DLT are data quality constraints that you can define to validate your data. They help ensure data quality by:\n1. Validating data quality rules\n2. Monitoring data quality metrics\n3. Quarantining invalid records\n4. Providing quality monitoring dashboards"
  },

  // Data Governance
  {
    id: 10,
    category: "Data Governance",
    front: "What is Unity Catalog?",
    back: "Unity Catalog is a unified governance solution for data and AI assets in the Databricks Lakehouse Platform. It provides centralized access control, auditing, lineage, and data discovery capabilities."
  },
  {
    id: 11,
    category: "Data Governance",
    front: "What are the key features of Unity Catalog?",
    back: "1. Centralized Access Control\n2. Data Lineage\n3. Audit Logging\n4. Data Discovery\n5. Fine-grained Access Control\n6. Cross-workspace Governance"
  },
  {
    id: 12,
    category: "Data Governance",
    front: "How does Unity Catalog handle data security?",
    back: "Unity Catalog provides comprehensive data security through:\n1. Fine-grained access control (table, column, row level)\n2. Identity federation\n3. Credential management\n4. Data encryption\n5. Audit logs\n6. Compliance reporting"
  },

  // Apache Spark
  {
    id: 13,
    category: "Apache Spark",
    front: "What is Apache Spark?",
    back: "Apache Spark is an open-source, distributed computing system used for big data processing and analytics. It provides an interface for programming entire clusters with implicit data parallelism and fault tolerance."
  },
  {
    id: 14,
    category: "Apache Spark",
    front: "What are the main components of Apache Spark?",
    back: "1. Spark Core: Basic functionality\n2. Spark SQL: SQL and structured data processing\n3. Spark Streaming: Real-time data processing\n4. MLlib: Machine learning library\n5. GraphX: Graph processing"
  },
  {
    id: 15,
    category: "Apache Spark",
    front: "What are RDDs in Apache Spark?",
    back: "RDD (Resilient Distributed Dataset) is:\n1. The fundamental data structure of Spark\n2. An immutable distributed collection of objects\n3. Capable of being processed in parallel\n4. Fault-tolerant through lineage tracking\n5. Can be cached in memory for faster processing"
  },

  // Production Pipelines
  {
    id: 16,
    category: "Production Pipelines",
    front: "What is Auto Loader?",
    back: "Auto Loader is a feature in Delta Live Tables that automatically detects and processes new files as they arrive in cloud storage. It provides efficient, incremental data ingestion with automatic schema inference."
  },
  {
    id: 17,
    category: "Production Pipelines",
    front: "What are the benefits of using Auto Loader?",
    back: "1. Automatic file detection\n2. Incremental processing\n3. Schema inference\n4. Scalable performance\n5. Fault tolerance\n6. Cost-effective processing"
  },
  {
    id: 18,
    category: "Production Pipelines",
    front: "What are the key considerations for production pipelines?",
    back: "1. Data quality and validation\n2. Error handling and recovery\n3. Performance optimization\n4. Monitoring and alerting\n5. Resource management\n6. Cost optimization\n7. Security and compliance"
  },

  // Jobs and Scheduling
  {
    id: 19,
    category: "Jobs and Scheduling",
    front: "What is the difference between Job clusters and All-purpose clusters?",
    back: "Job clusters are optimized for automated workflows and shut down after task completion, while All-purpose clusters are designed for interactive development and remain active until manually terminated. Job clusters are more cost-effective for scheduled tasks."
  },
  {
    id: 20,
    category: "Jobs and Scheduling",
    front: "What are the key features of Databricks Jobs?",
    back: "1. Task orchestration\n2. Job scheduling\n3. Dependency management\n4. Retry policies\n5. Notifications\n6. Resource management\n7. Monitoring and logging"
  },
  {
    id: 21,
    category: "Jobs and Scheduling",
    front: "What are the best practices for job scheduling?",
    back: "1. Use job clusters for automated tasks\n2. Set appropriate timeout values\n3. Configure retry policies\n4. Implement proper error handling\n5. Monitor job performance\n6. Optimize resource allocation\n7. Use job parameters for flexibility"
  }
];

const Flashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([...flashcards]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();

  const categories = [...new Set(flashcards.map(card => card.category))];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledCards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + shuffledCards.length) % shuffledCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const newShuffled = [...shuffledCards];
    for (let i = newShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
    }
    setShuffledCards(newShuffled);
    setCurrentIndex(0);
  };

  const handleCategorySelect = (category) => {
    setIsFlipped(false);
    setSelectedCategory(category);
    const filteredCards = category
      ? flashcards.filter(card => card.category === category)
      : [...flashcards];
    setShuffledCards(filteredCards);
    setCurrentIndex(0);
  };

  const currentCard = shuffledCards[currentIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Flashcards
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Review key concepts and test your knowledge
        </Typography>

        {/* Category Filter */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                icon={<CategoryIcon />}
                label="All Categories"
                onClick={() => handleCategorySelect(null)}
                color={!selectedCategory ? "primary" : "default"}
                sx={{ mr: 1 }}
              />
            </Grid>
            {categories.map((category) => (
              <Grid item key={category}>
                <Chip
                  label={category}
                  onClick={() => handleCategorySelect(category)}
                  color={selectedCategory === category ? "primary" : "default"}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Flashcard Container */}
        <Box
          sx={{
            perspective: '1000px',
            minHeight: 300,
            mb: 3,
          }}
        >
          {/* Flashcard */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front Side */}
            <Card
              onClick={() => setIsFlipped(!isFlipped)}
              sx={{
                position: 'absolute',
                width: '100%',
                minHeight: 300,
                backfaceVisibility: 'hidden',
                cursor: 'pointer',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.paper',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {currentCard.category}
              </Typography>
              <Typography variant="h5" component="div" sx={{ mb: 2, textAlign: 'center' }}>
                {currentCard.front}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to flip
              </Typography>
            </Card>

            {/* Back Side */}
            <Card
              onClick={() => setIsFlipped(!isFlipped)}
              sx={{
                position: 'absolute',
                width: '100%',
                minHeight: 300,
                backfaceVisibility: 'hidden',
                cursor: 'pointer',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.paper',
                transform: 'rotateY(180deg)',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {currentCard.category}
              </Typography>
              <Typography variant="h5" component="div" sx={{ mb: 2, textAlign: 'center', whiteSpace: 'pre-line' }}>
                {currentCard.back}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to flip
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Navigation and Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePrevious}
            disabled={shuffledCards.length <= 1}
          >
            Previous
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<ShuffleIcon />}
              onClick={handleShuffle}
              disabled={shuffledCards.length <= 1}
            >
              Shuffle
            </Button>
            <Button
              startIcon={<FlipIcon />}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              Flip Card
            </Button>
          </Box>

          <Button
            endIcon={<NavigateNextIcon />}
            onClick={handleNext}
            disabled={shuffledCards.length <= 1}
          >
            Next
          </Button>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Card {currentIndex + 1} of {shuffledCards.length}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Flashcards; 