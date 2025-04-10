import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PlayArrow as PlayIcon,
  Timelapse as TimelapseIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LearningContent from './LearningContent';

const learningModules = [
  {
    title: '1. Databricks Lakehouse Platform',
    topics: [
      {
        name: 'Data Lakehouse Architecture',
        status: 'not-started',
        subtopics: [
          'Data Lakehouse vs Data Warehouse',
          'Data Quality Improvements',
          'Silver and Gold Tables',
          'Platform Architecture',
        ],
      },
      {
        name: 'Cluster Management',
        status: 'not-started',
        subtopics: [
          'All-purpose vs Jobs Clusters',
          'Runtime Versioning',
          'Cluster Filtering',
          'Cluster Termination',
          'Cluster Restart Scenarios',
        ],
      },
      {
        name: 'Notebooks and Development',
        status: 'not-started',
        subtopics: [
          'Multi-language Support',
          'Notebook Dependencies',
          'Notebook Sharing',
          'Databricks Repos',
          'Version Control',
        ],
      },
    ],
  },
  {
    title: '2. ELT with Apache Spark',
    topics: [
      {
        name: 'Data Extraction',
        status: 'not-started',
        subtopics: [
          'File and Directory Extraction',
          'External Source Integration',
          'JDBC Connections',
          'Data Type Handling',
        ],
      },
      {
        name: 'Data Transformation',
        status: 'not-started',
        subtopics: [
          'Views and CTEs',
          'Deduplication',
          'Data Validation',
          'Timestamp Operations',
          'String Manipulation',
          'Nested Data Handling',
          'Array Functions',
          'JSON Processing',
        ],
      },
      {
        name: 'SQL Operations',
        status: 'not-started',
        subtopics: [
          'Join Operations',
          'PIVOT Operations',
          'SQL UDFs',
          'CASE/WHEN Statements',
        ],
      },
    ],
  },
  {
    title: '3. Incremental Data Processing',
    topics: [
      {
        name: 'Delta Lake Fundamentals',
        status: 'not-started',
        subtopics: [
          'ACID Transactions',
          'Data vs Metadata',
          'Managed vs External Tables',
          'Table Location and Structure',
        ],
      },
      {
        name: 'Delta Lake Operations',
        status: 'not-started',
        subtopics: [
          'Time Travel',
          'Version Management',
          'Z-ordering',
          'Vacuum Operations',
          'Optimize Command',
          'MERGE Operations',
          'COPY INTO',
        ],
      },
      {
        name: 'Delta Live Tables',
        status: 'not-started',
        subtopics: [
          'Pipeline Components',
          'Auto Loader',
          'Constraint Handling',
          'Change Data Capture',
          'Pipeline Monitoring',
        ],
      },
    ],
  },
  {
    title: '4. Production Pipelines',
    topics: [
      {
        name: 'Job Management',
        status: 'not-started',
        subtopics: [
          'Task Configuration',
          'Task Dependencies',
          'Execution History',
          'CRON Scheduling',
        ],
      },
      {
        name: 'Error Handling',
        status: 'not-started',
        subtopics: [
          'Task Debugging',
          'Retry Policies',
          'Alert Configuration',
          'Email Notifications',
        ],
      },
    ],
  },
  {
    title: '5. Data Governance',
    topics: [
      {
        name: 'Unity Catalog',
        status: 'not-started',
        subtopics: [
          'Data Governance Areas',
          'Metastores vs Catalogs',
          'Securables',
          'Service Principals',
          'Security Modes',
        ],
      },
      {
        name: 'Access Control',
        status: 'not-started',
        subtopics: [
          'Cluster Configuration',
          'SQL Warehouse Setup',
          'Namespace Management',
          'Access Control Implementation',
        ],
      },
      {
        name: 'Best Practices',
        status: 'not-started',
        subtopics: [
          'Metastore Placement',
          'Service Principal Usage',
          'Business Unit Segregation',
          'Security Implementation',
        ],
      },
    ],
  },
];

const WelcomeScreen = () => (
  <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
    <Typography variant="h4" gutterBottom>
      Welcome to Learning Modules
    </Typography>
    <Typography variant="body1" paragraph>
      Get started with your Databricks Data Engineer certification preparation by selecting a topic from the left sidebar.
    </Typography>
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        Available Sections:
      </Typography>
      <List>
        {learningModules.map((module, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <PlayIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={module.title}
              secondary={`${module.topics.length} topics`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
    <Typography variant="body2" color="text.secondary">
      Click on any module to explore its topics and start learning
    </Typography>
  </Paper>
);

function LearningModules() {
  const { topic } = useParams();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('learning_modules');
    return saved ? JSON.parse(saved) : learningModules;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (topic) {
      // Find the module and topic that matches the URL parameter
      for (let moduleIndex = 0; moduleIndex < learningModules.length; moduleIndex++) {
        const module = learningModules[moduleIndex];
        for (let topicIndex = 0; topicIndex < module.topics.length; topicIndex++) {
          if (module.topics[topicIndex].name === decodeURIComponent(topic)) {
            setSelectedModule(moduleIndex);
            setSelectedTopic(topicIndex);
            break;
          }
        }
      }
    }
  }, [topic]);

  // Save to localStorage whenever modules change
  useEffect(() => {
    localStorage.setItem('learning_modules', JSON.stringify(modules));
  }, [modules]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <PlayIcon color="primary" />;
      default:
        return <UncheckedIcon color="action" />;
    }
  };

  const handleStartLearning = (moduleIndex, topicIndex) => {
    // Update topic status to in-progress
    const newModules = [...modules];
    const topic = newModules[moduleIndex].topics[topicIndex];
    newModules[moduleIndex].topics[topicIndex].status = 'in-progress';
    setModules(newModules);

    // Convert topic name to URL-friendly format
    const moduleId = topic.name.toLowerCase().replace(/\s+/g, '-');
    
    // Navigate to the new module-based learning route
    navigate(`/module/${moduleId}`);
  };

  const handleSubtopicClick = (moduleIndex, topicIndex, subtopicIndex) => {
    const newModules = [...modules];
    const topic = newModules[moduleIndex].topics[topicIndex];
    
    // Initialize completed array if it doesn't exist
    if (!topic.completedSubtopics) {
      topic.completedSubtopics = new Array(topic.subtopics.length).fill(false);
    }
    
    // Toggle completion status
    topic.completedSubtopics[subtopicIndex] = !topic.completedSubtopics[subtopicIndex];
    
    // Update topic status based on subtopics
    const allCompleted = topic.completedSubtopics.every(status => status);
    const anyCompleted = topic.completedSubtopics.some(status => status);
    
    if (allCompleted) {
      topic.status = 'completed';
    } else if (anyCompleted) {
      topic.status = 'in-progress';
    } else {
      topic.status = 'not-started';
    }
    
    setModules(newModules);
  };

  const handleNavigateToContent = () => {
    if (selectedTopic !== null && selectedModule !== null) {
      setOpenDialog(false);
      const topic = modules[selectedModule].topics[selectedTopic];
      // Update the topic status to in-progress if it's not already completed
      if (topic.status !== 'completed') {
        const newModules = [...modules];
        newModules[selectedModule].topics[selectedTopic].status = 'in-progress';
        setModules(newModules);
        localStorage.setItem('learning_modules', JSON.stringify(newModules));
      }
      // Navigate to the learning content with the new route
      navigate(`/learning-content/${encodeURIComponent(topic.name)}`, {
        state: { 
          moduleTitle: modules[selectedModule].title,
          topicName: topic.name
        }
      });
    }
  };

  const calculateOverallProgress = () => {
    const totalTopics = modules.reduce((acc, module) => 
      acc + module.topics.reduce((tacc, topic) => tacc + topic.subtopics.length, 0), 0);
    
    const completedTopics = modules.reduce((acc, module) => 
      acc + module.topics.reduce((tacc, topic) => 
        tacc + (topic.completedSubtopics?.filter(Boolean).length || 0), 0), 0);
    
    return Math.round((completedTopics / totalTopics) * 100);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Modules
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Overall Progress
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={calculateOverallProgress()} 
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {Math.round(calculateOverallProgress())}% Complete
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3}>
            <List component="nav">
              {learningModules.map((module, moduleIndex) => (
                <React.Fragment key={module.title}>
                  <ListItem
                    button
                    selected={selectedModule === moduleIndex}
                    onClick={() => setSelectedModule(moduleIndex)}
                  >
                    <ListItemText primary={module.title} />
                  </ListItem>
                  {selectedModule === moduleIndex && (
                    <List component="div" disablePadding>
                      {module.topics.map((topic, topicIndex) => (
                        <ListItem
                          button
                          key={topic.name}
                          selected={selectedTopic === topicIndex}
                          onClick={() => handleStartLearning(moduleIndex, topicIndex)}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon>
                            {topic.status === 'completed' ? (
                              <CheckCircleIcon color="success" />
                            ) : topic.status === 'in-progress' ? (
                              <TimelapseIcon color="primary" />
                            ) : (
                              <UncheckedIcon />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={topic.name} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          {selectedModule !== null && selectedTopic !== null ? (
            <LearningContent
              module={modules[selectedModule]}
              topic={modules[selectedModule].topics[selectedTopic]}
            />
          ) : (
            <WelcomeScreen />
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Start Learning</DialogTitle>
        <DialogContent>
          <Typography>
            Are you ready to start learning about{' '}
            {selectedModule !== null && selectedTopic !== null
              ? modules[selectedModule].topics[selectedTopic].name
              : ''}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigateToContent}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LearningModules; 