import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  Container,
  FormControl,
  Alert,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { moduleQuestions } from '../data/moduleQuestions';

const ModuleQuiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questions = moduleQuestions[moduleId] || [];

  useEffect(() => {
    if (questions.length === 0) {
      // If no questions found for this module, redirect to modules page
      navigate('/learning-modules');
    }
  }, [questions, navigate]);

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNext = () => {
    // Check if answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = parseInt(selectedAnswer) === currentQuestion.correctAnswer;
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    // Save progress to localStorage
    const quizResults = JSON.parse(localStorage.getItem('module_quiz_results') || '{}');
    if (!quizResults[moduleId]) {
      quizResults[moduleId] = {
        attempts: [],
      };
    }

    // If this is the last question, save the attempt
    if (currentQuestionIndex === questions.length - 1) {
      const finalScore = isAnswerCorrect ? score + 1 : score;
      quizResults[moduleId].attempts.push({
        date: new Date().toISOString(),
        score: finalScore,
        totalQuestions: questions.length,
        percentage: Math.round((finalScore / questions.length) * 100)
      });
      localStorage.setItem('module_quiz_results', JSON.stringify(quizResults));
    }

    // Wait for 1.5 seconds before moving to next question or showing final score
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setShowScore(false);
  };

  const handleBackToDashboard = () => {
    navigate('/learning-modules');
  };

  if (questions.length === 0) {
    return (
      <Container maxWidth="sm">
        <Alert severity="info">
          No questions available for this module.
          <Button color="primary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  if (showScore) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Container maxWidth="sm">
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Quiz Complete!
            </Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom align="center">
                Your Score: {percentage}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={percentage} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body1" paragraph align="center">
              You got {score} out of {questions.length} questions correct.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button variant="contained" onClick={handleRetry}>
                Try Again
              </Button>
              <Button variant="outlined" onClick={handleBackToDashboard}>
                Back to Modules
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestionIndex / questions.length) * 100} 
            sx={{ mt: 1 }}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          {currentQuestion.question}
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
          <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={option}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {showFeedback && (
          <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 2 }}>
            {isCorrect ? "Correct! " : "Incorrect. "}
            {currentQuestion.explanation}
          </Alert>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBackToDashboard}
          >
            Back to Modules
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={selectedAnswer === ''}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ModuleQuiz; 