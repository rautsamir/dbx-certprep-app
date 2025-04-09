import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  LinearProgress,
  Grid,
  Paper,
} from '@mui/material';
import { NavigateNext as NextIcon, NavigateBefore as PrevIcon } from '@mui/icons-material';

const sampleQuestions = [
  // Section 1: Databricks Lakehouse Platform
  {
    id: 1,
    question: 'What is the primary difference between a data lakehouse and a traditional data warehouse?',
    options: [
      'Data lakehouse combines data lake storage with warehouse features',
      'Data lakehouse is only for big data',
      'Data lakehouse requires less storage',
      'Data lakehouse is only for streaming data',
    ],
    correctAnswer: 0,
    explanation: 'A data lakehouse combines the cost-effective storage of a data lake with the ACID transactions and schema enforcement of a data warehouse.',
  },
  {
    id: 2,
    question: 'Which of the following best describes the relationship between silver and gold tables in a lakehouse architecture?',
    options: [
      'Silver tables are always derived from bronze tables, while gold tables are always derived from silver tables',
      'Silver tables are for raw data, while gold tables are for processed data',
      'Silver tables are for intermediate processing, while gold tables are for business-ready data',
      'Silver and gold tables are interchangeable terms',
    ],
    correctAnswer: 2,
    explanation: 'Silver tables contain cleaned and standardized data, while gold tables contain business-ready data optimized for specific use cases.',
  },
  {
    id: 3,
    question: 'What is the main difference between all-purpose clusters and jobs clusters in Databricks?',
    options: [
      'All-purpose clusters are always larger',
      'Jobs clusters are optimized for production workloads',
      'All-purpose clusters support interactive notebooks',
      'Jobs clusters are free to use',
    ],
    correctAnswer: 2,
    explanation: 'All-purpose clusters are designed for interactive development and support notebook usage, while jobs clusters are optimized for production workloads.',
  },
  {
    id: 4,
    question: 'How does Databricks Runtime versioning work for clusters?',
    options: [
      'Runtime versions are automatically updated',
      'Runtime versions are fixed and cannot be changed',
      'Runtime versions can be selected when creating a cluster',
      'Runtime versions are determined by the cloud provider',
    ],
    correctAnswer: 2,
    explanation: 'When creating a cluster, you can select a specific Databricks Runtime version that includes the desired Spark version and additional libraries.',
  },
  {
    id: 5,
    question: 'What happens when a cluster is terminated in Databricks?',
    options: [
      'All data is deleted',
      'The cluster configuration is preserved',
      'All notebooks are deleted',
      'The cluster is permanently removed',
    ],
    correctAnswer: 1,
    explanation: 'When a cluster is terminated, its configuration is preserved but compute resources are released. You can restart the cluster with the same configuration later.',
  },

  // Section 2: ELT with Apache Spark
  {
    id: 6,
    question: 'How do you extract data from a directory of files in Spark SQL?',
    options: [
      'Use the DIRECTORY keyword in FROM clause',
      'Use a wildcard pattern in the path',
      'Use the EXTRACT keyword',
      'Use the LOAD keyword',
    ],
    correctAnswer: 1,
    explanation: 'You can use wildcard patterns in the path to read from multiple files in a directory, e.g., FROM "/path/to/files/*.csv".',
  },
  {
    id: 7,
    question: 'What is the purpose of a temporary view in Spark SQL?',
    options: [
      'To store data permanently',
      'To create a temporary reference to data',
      'To optimize query performance',
      'To share data between users',
    ],
    correctAnswer: 1,
    explanation: 'A temporary view creates a temporary reference to data that exists only for the current session and is not persisted.',
  },
  {
    id: 8,
    question: 'How does the count_if function differ from count where x is null?',
    options: [
      'count_if is more efficient',
      'count_if can count any condition, not just null values',
      'count_if is deprecated',
      'They are exactly the same',
    ],
    correctAnswer: 1,
    explanation: 'count_if can count rows based on any condition, while count where x is null specifically counts null values.',
  },
  {
    id: 9,
    question: 'What is the purpose of the explode function in Spark SQL?',
    options: [
      'To split a string into multiple rows',
      'To convert a struct into multiple columns',
      'To flatten an array into multiple rows',
      'To combine multiple rows into one',
    ],
    correctAnswer: 2,
    explanation: 'The explode function is used to flatten an array into multiple rows, creating a new row for each element in the array.',
  },
  {
    id: 10,
    question: 'How do you define a SQL UDF in Databricks?',
    options: [
      'Using the CREATE FUNCTION syntax',
      'Using the DEFINE FUNCTION syntax',
      'Using the CREATE UDF syntax',
      'Using the REGISTER FUNCTION syntax',
    ],
    correctAnswer: 0,
    explanation: 'SQL UDFs are defined using the CREATE FUNCTION syntax, which allows you to specify the function name, parameters, and return type.',
  },

  // Section 3: Incremental Data Processing
  {
    id: 11,
    question: 'Where does Delta Lake provide ACID transactions?',
    options: [
      'Only during table creation',
      'Only during table deletion',
      'During all table operations',
      'Only during table updates',
    ],
    correctAnswer: 2,
    explanation: 'Delta Lake provides ACID transactions for all table operations, ensuring data consistency and reliability.',
  },
  {
    id: 12,
    question: 'What is the difference between managed and external tables in Delta Lake?',
    options: [
      'Managed tables are always faster',
      'External tables are always more secure',
      'Managed tables are stored in the default location, external tables have custom locations',
      'There is no difference',
    ],
    correctAnswer: 2,
    explanation: 'Managed tables are stored in the default location specified by the metastore, while external tables can be stored in any location specified by the user.',
  },
  {
    id: 13,
    question: 'How do you roll back a table to a previous version in Delta Lake?',
    options: [
      'Using the ROLLBACK command',
      'Using the RESTORE command',
      'Using the REVERT command',
      'Using the UNDO command',
    ],
    correctAnswer: 1,
    explanation: 'The RESTORE command in Delta Lake allows you to roll back a table to a previous version using time travel.',
  },
  {
    id: 14,
    question: 'What is the purpose of Z-ordering in Delta Lake?',
    options: [
      'To compress data',
      'To improve query performance on specific columns',
      'To enable time travel',
      'To reduce storage costs',
    ],
    correctAnswer: 1,
    explanation: 'Z-ordering is used to colocate related information in the same files, improving query performance on specific columns.',
  },
  {
    id: 15,
    question: 'When should you use the MERGE command in Delta Lake?',
    options: [
      'Only for inserting new data',
      'Only for updating existing data',
      'For performing upserts (update/insert) based on a condition',
      'Only for deleting data',
    ],
    correctAnswer: 2,
    explanation: 'The MERGE command is used for performing upserts (update/insert) based on a condition, similar to SQL MERGE.',
  },

  // Section 4: Production Pipelines
  {
    id: 16,
    question: 'What is the benefit of using multiple tasks in Databricks Jobs?',
    options: [
      'To reduce costs',
      'To enable parallel execution and dependencies',
      'To increase security',
      'To improve data quality',
    ],
    correctAnswer: 1,
    explanation: 'Multiple tasks in Jobs allow for parallel execution and dependencies, enabling complex workflow orchestration.',
  },
  {
    id: 17,
    question: 'How do you set up a predecessor task in Databricks Jobs?',
    options: [
      'Using the DEPENDS ON keyword',
      'Using the PREDECESSOR keyword',
      'Using the BEFORE keyword',
      'Using the SEQUENCE keyword',
    ],
    correctAnswer: 0,
    explanation: 'Tasks can be linked using the DEPENDS ON keyword to establish dependencies between tasks.',
  },
  {
    id: 18,
    question: 'What is CRON in Databricks Jobs?',
    options: [
      'A type of cluster',
      'A scheduling syntax',
      'A monitoring tool',
      'A security feature',
    ],
    correctAnswer: 1,
    explanation: 'CRON is a scheduling syntax used in Databricks Jobs to define when tasks should run.',
  },
  {
    id: 19,
    question: 'How do you set up a retry policy for a failed task?',
    options: [
      'Using the RETRY command',
      'Using the RETRY POLICY setting in task configuration',
      'Using the RETRY ON FAILURE keyword',
      'Using the RETRY COUNT setting',
    ],
    correctAnswer: 1,
    explanation: 'Retry policies can be configured in the task settings to automatically retry failed tasks.',
  },
  {
    id: 20,
    question: 'What types of alerts can be configured for failed tasks?',
    options: [
      'Only email alerts',
      'Only Slack alerts',
      'Multiple notification channels including email',
      'Only webhook alerts',
    ],
    correctAnswer: 2,
    explanation: 'Databricks Jobs supports multiple notification channels for alerts, including email, Slack, and webhooks.',
  },

  // Section 5: Data Governance
  {
    id: 21,
    question: 'What are the four areas of data governance in Databricks?',
    options: [
      'Security, Privacy, Compliance, and Quality',
      'Access, Storage, Processing, and Monitoring',
      'Authentication, Authorization, Audit, and Encryption',
      'Data, Metadata, Schema, and Storage',
    ],
    correctAnswer: 0,
    explanation: 'The four areas of data governance in Databricks are Security, Privacy, Compliance, and Quality.',
  },
  {
    id: 22,
    question: 'What is the difference between metastores and catalogs in Unity Catalog?',
    options: [
      'Metastores are for data, catalogs are for metadata',
      'Metastores are for storage, catalogs are for organization',
      'Metastores are for tables, catalogs are for schemas',
      'There is no difference',
    ],
    correctAnswer: 1,
    explanation: 'Metastores manage the storage and access to data, while catalogs provide organization and discovery of data assets.',
  },
  {
    id: 23,
    question: 'What is a service principal in Databricks?',
    options: [
      'A type of cluster',
      'A non-human identity for automated access',
      'A security group',
      'A type of database',
    ],
    correctAnswer: 1,
    explanation: 'A service principal is a non-human identity that can be used for automated access to Databricks resources.',
  },
  {
    id: 24,
    question: 'Which cluster security modes are compatible with Unity Catalog?',
    options: [
      'Only single-user mode',
      'Only shared mode',
      'Both single-user and shared mode',
      'No security modes are compatible',
    ],
    correctAnswer: 2,
    explanation: 'Unity Catalog is compatible with both single-user and shared cluster security modes.',
  },
  {
    id: 25,
    question: 'What is the best practice for segregating business units in Unity Catalog?',
    options: [
      'Using different workspaces',
      'Using different clusters',
      'Using different catalogs',
      'Using different databases',
    ],
    correctAnswer: 2,
    explanation: 'Using different catalogs for different business units is a best practice for data segregation in Unity Catalog.',
  },
];

function Quiz() {
  // Initialize state from localStorage or default values
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem('quiz_current_question');
    return saved ? parseInt(saved) : 0;
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('quiz_score');
    return saved ? parseInt(saved) : 0;
  });
  const [completedQuestions, setCompletedQuestions] = useState(() => {
    const saved = localStorage.getItem('quiz_completed_questions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever these values change
  React.useEffect(() => {
    localStorage.setItem('quiz_current_question', currentQuestion.toString());
    localStorage.setItem('quiz_score', score.toString());
    localStorage.setItem('quiz_completed_questions', JSON.stringify(completedQuestions));
  }, [currentQuestion, score, completedQuestions]);

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(parseInt(event.target.value));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (selectedAnswer === sampleQuestions[currentQuestion].correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
    }
    const newCompletedQuestions = [...completedQuestions, currentQuestion];
    setCompletedQuestions(newCompletedQuestions);
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompletedQuestions([]);
    localStorage.removeItem('quiz_current_question');
    localStorage.removeItem('quiz_score');
    localStorage.removeItem('quiz_completed_questions');
  };

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Practice Quiz
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Question {currentQuestion + 1} of {sampleQuestions.length}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {sampleQuestions[currentQuestion].question}
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
            <RadioGroup
              value={selectedAnswer}
              onChange={handleAnswerSelect}
            >
              {sampleQuestions[currentQuestion].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option}
                  disabled={showExplanation}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {showExplanation && (
            <Paper
              sx={{
                p: 2,
                mt: 2,
                bgcolor: selectedAnswer === sampleQuestions[currentQuestion].correctAnswer
                  ? 'success.light'
                  : 'error.light',
              }}
            >
              <Typography variant="body1">
                {sampleQuestions[currentQuestion].explanation}
              </Typography>
            </Paper>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<PrevIcon />}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              endIcon={<NextIcon />}
              onClick={handleNext}
              disabled={!showExplanation || currentQuestion === sampleQuestions.length - 1}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>

      {currentQuestion === sampleQuestions.length - 1 && showExplanation && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quiz Complete!
            </Typography>
            <Typography variant="body1">
              Your score: {score} out of {sampleQuestions.length}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleRetake}
            >
              Retake Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default Quiz; 