import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

function LearningModules() {
  const [expanded, setExpanded] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('learning_modules');
    return saved ? JSON.parse(saved) : learningModules;
  });
  const navigate = useNavigate();

  // Save to localStorage whenever modules change
  React.useEffect(() => {
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

  const handleStartLearning = (module, topic) => {
    // Update topic status to in-progress
    const newModules = [...modules];
    const moduleIndex = newModules.findIndex(m => m.title === module.title);
    const topicIndex = newModules[moduleIndex].topics.findIndex(t => t.name === topic.name);
    newModules[moduleIndex].topics[topicIndex].status = 'in-progress';
    setModules(newModules);

    setSelectedTopic({ module, topic });
    setOpenDialog(true);
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
    if (selectedTopic) {
      setOpenDialog(false);
      navigate(`/learning/${encodeURIComponent(selectedTopic.topic.name)}`);
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
        <Typography variant="h6" gutterBottom>
          Overall Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={calculateOverallProgress()}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {calculateOverallProgress()}% Complete
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module, moduleIndex) => (
          <Grid item xs={12} key={module.title}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {module.title}
                </Typography>
                {module.topics.map((topic, topicIndex) => (
                  <Accordion
                    key={topic.name}
                    expanded={expanded === `${moduleIndex}-${topicIndex}`}
                    onChange={handleChange(`${moduleIndex}-${topicIndex}`)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <ListItemIcon>{getStatusIcon(topic.status)}</ListItemIcon>
                        <Typography>{topic.name}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {topic.subtopics.map((subtopic, subtopicIndex) => (
                          <ListItem
                            key={subtopic}
                            button
                            onClick={() => handleSubtopicClick(moduleIndex, topicIndex, subtopicIndex)}
                          >
                            <ListItemIcon>
                              {topic.completedSubtopics && topic.completedSubtopics[subtopicIndex] ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <UncheckedIcon color="action" />
                              )}
                            </ListItemIcon>
                            <ListItemText primary={subtopic} />
                          </ListItem>
                        ))}
                      </List>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PlayIcon />}
                          onClick={() => handleStartLearning(module, topic)}
                        >
                          Start Learning
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
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
            Are you ready to start learning about {selectedTopic?.topic.name}?
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