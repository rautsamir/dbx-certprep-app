import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Book as BookIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

const LearningContent = () => {
  const { topic } = useParams();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const decodedTopic = decodeURIComponent(topic);
  const { moduleTitle, topicName } = location.state || {};

  const content = {
    'Data Lakehouse Architecture': {
      introduction: `The Data Lakehouse combines the best features of data lakes and data warehouses. It provides data structure and management features similar to data warehouses, directly on the low-cost storage used for data lakes.`,
      keyPoints: [
        'ACID transactions on data lakes',
        'Schema enforcement and governance',
        'BI support directly on data lakes',
        'Open storage formats (Parquet/Delta)',
        'Support for diverse data types'
      ],
      codeExample: `
# Example of creating a Delta table
spark.sql("""
CREATE TABLE customer_data (
  id LONG,
  name STRING,
  email STRING,
  signup_date DATE
)
USING DELTA
""")`,
      practice: [
        'Compare traditional data warehouse vs lakehouse architecture',
        'Identify use cases for data lakehouse',
        'Explain Delta Lake benefits'
      ]
    },
    'Cluster Management': {
      introduction: `Databricks clusters are groups of computers that you can use to execute commands. Understanding cluster types and configurations is crucial for optimal performance and cost management.`,
      keyPoints: [
        'All-purpose vs Jobs clusters',
        'Auto-scaling and auto-termination',
        'Runtime versions and compatibility',
        'Cost management and optimization',
        'Security and access control'
      ],
      codeExample: `
# Example of cluster configuration
{
  "spark_version": "10.4.x-scala2.12",
  "node_type_id": "Standard_DS3_v2",
  "num_workers": 2,
  "autotermination_minutes": 120,
  "autoscale": {
    "min_workers": 1,
    "max_workers": 4
  }
}`,
      practice: [
        'Create and configure a new cluster',
        'Implement auto-scaling policies',
        'Monitor cluster performance'
      ]
    },
    'Notebooks and Development': {
      introduction: `Databricks notebooks provide an interactive environment for data exploration, analysis, and collaboration. They support multiple languages and offer various features for development and sharing.`,
      keyPoints: [
        'Multi-language support (Python, SQL, R, Scala)',
        'Notebook workflows and job scheduling',
        'Version control integration',
        'Collaboration features',
        'Magic commands and utilities'
      ],
      codeExample: `
# Example of notebook commands
%sql
CREATE TABLE IF NOT EXISTS sample_table
USING DELTA
AS SELECT * FROM parquet.'/data/sample';

%python
from pyspark.sql.functions import *
df = spark.table("sample_table")
display(df)`,
      practice: [
        'Create and run notebooks in different languages',
        'Use notebook utilities and magic commands',
        'Implement version control for notebooks'
      ]
    }
  };

  const topicContent = content[decodedTopic];

  if (!topicContent) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Content for this topic is being developed. Please check back later.
      </Alert>
    );
  }

  const steps = [
    {
      label: 'Introduction',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            {topicContent.introduction}
          </Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Points
              </Typography>
              <List>
                {topicContent.keyPoints.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      label: 'Code Examples',
      content: (
        <Box>
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="subtitle2" gutterBottom>
              <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Example Implementation
            </Typography>
            <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
              <code>{topicContent.codeExample}</code>
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      label: 'Practice',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Practice Exercises
          </Typography>
          <List>
            {topicContent.practice.map((exercise, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={exercise} />
              </ListItem>
            ))}
          </List>
        </Box>
      ),
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {decodedTopic}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip icon={<BookIcon />} label="Learning" color="primary" />
          <Chip icon={<QuizIcon />} label="Quiz Available" color="secondary" />
        </Box>
        <Divider />
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.content}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default LearningContent; 