import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  ListItemButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Slider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
  CheckCircle,
  RadioButtonUnchecked,
  Download,
} from '@mui/icons-material';

// Define all topics from the learning modules
const allTopics = [
  {
    module: 'Databricks Lakehouse Platform',
    topics: [
      'Data Lakehouse Architecture',
      'Cluster Management',
      'Notebooks and Development'
    ]
  },
  {
    module: 'ELT with Apache Spark',
    topics: [
      'Data Extraction',
      'Data Transformation',
      'SQL Operations'
    ]
  },
  {
    module: 'Incremental Data Processing',
    topics: [
      'Delta Lake Fundamentals',
      'Delta Lake Operations',
      'Delta Live Tables'
    ]
  },
  {
    module: 'Production Pipelines',
    topics: [
      'Job Management',
      'Error Handling'
    ]
  },
  {
    module: 'Data Governance',
    topics: [
      'Unity Catalog',
      'Access Control',
      'Best Practices'
    ]
  }
];

const generateStudyPlan = (durationInMonths) => {
  const totalWeeks = durationInMonths * 4;
  const allTopicsFlat = allTopics.flatMap(module => 
    module.topics.map(topic => ({
      module: module.module,
      topic: topic
    }))
  );
  
  // Calculate topics per week (rounded up)
  const topicsPerWeek = Math.ceil(allTopicsFlat.length / totalWeeks);
  
  const plan = [];
  let topicIndex = 0;
  
  // Define review activities
  const reviewActivities = [
    'Practice Quiz on Previous Topics',
    'Mock Exam',
    'Review Weak Areas',
    'Study Group Discussion',
    'Hands-on Lab Exercise',
    'Topic Review and Summary',
    'Practice Questions',
    'Concept Mapping Exercise'
  ];
  
  for (let month = 0; month < durationInMonths; month++) {
    const weeks = [];
    for (let week = 0; week < 4; week++) {
      const weekTopics = [];
      
      // Add topics if available
      for (let i = 0; i < topicsPerWeek && topicIndex < allTopicsFlat.length; i++) {
        weekTopics.push(allTopicsFlat[topicIndex].topic);
        topicIndex++;
      }
      
      // If no topics left, add review activities
      if (weekTopics.length === 0) {
        const reviewIndex = (month * 4 + week) % reviewActivities.length;
        weekTopics.push(reviewActivities[reviewIndex]);
      }
      
      weeks.push({
        topics: weekTopics,
        completed: new Array(weekTopics.length).fill(false)
      });
    }
    plan.push({
      month: month + 1,
      weeks
    });
  }
  
  return plan;
};

function StudyPlan() {
  const [duration, setDuration] = useState(3); // Default 3 months
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('study_plan');
    return saved ? JSON.parse(saved) : generateStudyPlan(3);
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('study_plan', JSON.stringify(plan));
  }, [plan]);

  const handleDurationChange = (event) => {
    const newDuration = event.target.value;
    setDuration(newDuration);
    setPlan(generateStudyPlan(newDuration));
  };

  const handleTopicToggle = (monthIndex, weekIndex, topicIndex) => {
    const newPlan = [...plan];
    newPlan[monthIndex].weeks[weekIndex].completed[topicIndex] = 
      !newPlan[monthIndex].weeks[weekIndex].completed[topicIndex];
    setPlan(newPlan);
  };

  const calculateProgress = (monthIndex) => {
    const month = plan[monthIndex];
    const totalTopics = month.weeks.reduce(
      (acc, week) => acc + week.topics.length,
      0
    );
    const completedTopics = month.weeks.reduce(
      (acc, week) => acc + week.completed.filter(Boolean).length,
      0
    );
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const handleResetProgress = () => {
    setPlan(generateStudyPlan(duration));
    localStorage.removeItem('study_plan');
  };

  const handleTopicClick = (topic) => {
    // Convert topic name to URL-friendly format
    const moduleId = topic.toLowerCase().replace(/\s+/g, '-');
    // Navigate to the new module-based learning route
    navigate(`/module/${moduleId}`);
  };

  const handleDownload = () => {
    const planText = plan.map(month => {
      const monthText = `Month ${month.month}\n` + 
        month.weeks.map((week, weekIndex) => {
          return `Week ${weekIndex + 1}:\n` +
            week.topics.map((topic, topicIndex) => 
              `${week.completed[topicIndex] ? '✓' : '○'} ${topic}`
            ).join('\n');
        }).join('\n\n');
      return monthText;
    }).join('\n\n');

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CalendarIcon sx={{ mr: 2 }} />
                  <Typography variant="h4" component="h1">
                    Customizable Study Plan
                  </Typography>
                </Box>
                
                <FormControl sx={{ minWidth: 200, mb: 4 }}>
                  <InputLabel>Study Duration</InputLabel>
                  <Select
                    value={duration}
                    label="Study Duration"
                    onChange={handleDurationChange}
                  >
                    <MenuItem value={1}>1 Month</MenuItem>
                    <MenuItem value={2}>2 Months</MenuItem>
                    <MenuItem value={3}>3 Months</MenuItem>
                    <MenuItem value={4}>4 Months</MenuItem>
                    <MenuItem value={6}>6 Months</MenuItem>
                  </Select>
                </FormControl>

                <Alert severity="info" sx={{ mb: 3 }}>
                  Your study plan has been optimized for {duration} month{duration > 1 ? 's' : ''}. 
                  Topics are distributed evenly to help you maintain a consistent pace.
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {plan.map((month, monthIndex) => (
            <Grid item xs={12} key={monthIndex}>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Month {month.month}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(monthIndex)} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {calculateProgress(monthIndex)}% Complete
                    </Typography>
                  </Box>

                  {month.weeks.map((week, weekIndex) => (
                    <Box key={weekIndex} sx={{ mb: 3 }}>
                      <Typography variant="h6" color="primary">
                        Week {weekIndex + 1}
                      </Typography>
                      <List>
                        {week.topics.map((topic, topicIndex) => (
                          <ListItem key={topicIndex} disablePadding>
                            <ListItemButton 
                              onClick={() => handleTopicToggle(monthIndex, weekIndex, topicIndex)}
                              sx={{
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                },
                              }}
                            >
                              <ListItemIcon>
                                {week.completed[topicIndex] ? (
                                  <CheckCircle color="success" />
                                ) : (
                                  <RadioButtonUnchecked />
                                )}
                              </ListItemIcon>
                              <ListItemText 
                                primary={topic}
                                sx={{
                                  '& .MuiTypography-root': {
                                    textDecoration: week.completed[topicIndex] ? 'line-through' : 'none',
                                    color: week.completed[topicIndex] ? 'text.secondary' : 'text.primary',
                                  },
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleDownload}
                startIcon={<Download />}
                sx={{ mr: 2 }}
              >
                Download Study Plan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default StudyPlan; 