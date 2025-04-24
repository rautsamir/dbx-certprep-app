import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Container
} from '@mui/material';

const exerciseContent = {
  'compare-warehouse': {
    title: 'Compare Data Warehouse vs Lakehouse Architecture',
    description: 'Compare and contrast traditional data warehouse architecture with modern data lakehouse architecture. Focus on key differences, advantages, and use cases for each approach.',
    hints: [
      'Consider aspects like data structure and schema',
      'Think about data types supported',
      'Compare cost and scalability',
      'Consider query performance and optimization',
      'Think about data governance and security'
    ]
  },
  'use-cases': {
    title: 'Identify Use Cases for Data Lakehouse',
    description: 'Identify and explain different use cases where a data lakehouse architecture would be the most appropriate solution. Provide specific examples and justify your choices.',
    hints: [
      'Consider big data analytics scenarios',
      'Think about machine learning workflows',
      'Consider real-time data processing needs',
      'Think about data science requirements',
      'Consider hybrid workload scenarios'
    ]
  },
  'delta-lake': {
    title: 'Explain Delta Lake Benefits',
    description: 'Explain the key benefits of Delta Lake and how they address common data lake challenges. Provide specific examples of how these benefits improve data management and processing.',
    hints: [
      'Consider ACID transaction support',
      'Think about time travel capabilities',
      'Consider schema enforcement and evolution',
      'Think about optimization techniques',
      'Consider unified batch and streaming'
    ]
  }
};

const PracticeExercise = () => {
  const { moduleId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const exercise = exerciseContent[exerciseId];
  
  if (!exercise) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Exercise not found. Please return to the module page.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(`/module/${moduleId}`)}
          sx={{ mt: 2 }}
        >
          Back to Module
        </Button>
      </Container>
    );
  }

  const handleSubmit = () => {
    if (answer.trim().length > 0) {
      // Save the answer to localStorage
      const savedAnswers = JSON.parse(localStorage.getItem('practice_answers') || '{}');
      savedAnswers[`${moduleId}-${exerciseId}`] = {
        answer,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('practice_answers', JSON.stringify(savedAnswers));
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {exercise.title}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {exercise.description}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            Helpful Hints:
          </Typography>
          <ul>
            {exercise.hints.map((hint, index) => (
              <li key={index}>
                <Typography variant="body1">{hint}</Typography>
              </li>
            ))}
          </ul>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label="Your Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          sx={{ mb: 3 }}
        />

        {submitted ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your answer has been saved! You can review and update it anytime.
          </Alert>
        ) : null}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleBack}>
            Back to Module
          </Button>
          {!submitted && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={answer.trim().length === 0}
            >
              Submit Answer
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PracticeExercise; 