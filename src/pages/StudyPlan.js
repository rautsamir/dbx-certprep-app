import React, { useState } from 'react';
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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const studyPlan = [
  {
    month: 'Month 1',
    weeks: [
      {
        week: 'Week 1',
        topics: [
          'Data Engineering Fundamentals',
          'Databricks Architecture',
          'Workspace Components',
        ],
        completed: [true, false, false],
      },
      {
        week: 'Week 2',
        topics: [
          'Delta Lake Basics',
          'ACID Transactions',
          'Time Travel',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 3',
        topics: [
          'Spark Fundamentals',
          'RDDs and DataFrames',
          'Spark SQL',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 4',
        topics: [
          'Data Modeling',
          'Schema Design',
          'Data Quality',
        ],
        completed: [false, false, false],
      },
    ],
  },
  {
    month: 'Month 2',
    weeks: [
      {
        week: 'Week 1',
        topics: [
          'Advanced Delta Lake',
          'Merge Operations',
          'Optimize and Z-Order',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 2',
        topics: [
          'Performance Tuning',
          'Partitioning Strategies',
          'Caching and Persistence',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 3',
        topics: [
          'Security and Governance',
          'Access Control',
          'Data Lineage',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 4',
        topics: [
          'Data Pipeline Development',
          'ETL Best Practices',
          'Error Handling',
        ],
        completed: [false, false, false],
      },
    ],
  },
  {
    month: 'Month 3',
    weeks: [
      {
        week: 'Week 1',
        topics: [
          'Practice Exams',
          'Topic Review',
          'Performance Analysis',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 2',
        topics: [
          'Mock Tests',
          'Weak Areas Review',
          'Study Group Sessions',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 3',
        topics: [
          'Final Review',
          'Exam Strategies',
          'Time Management',
        ],
        completed: [false, false, false],
      },
      {
        week: 'Week 4',
        topics: [
          'Exam Preparation',
          'Last Minute Review',
          'Exam Day Planning',
        ],
        completed: [false, false, false],
      },
    ],
  },
];

function StudyPlan() {
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('study_plan');
    return saved ? JSON.parse(saved) : studyPlan;
  });

  // Save to localStorage whenever the plan changes
  React.useEffect(() => {
    localStorage.setItem('study_plan', JSON.stringify(plan));
  }, [plan]);

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
    setPlan(studyPlan);
    localStorage.removeItem('study_plan');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Study Plan
      </Typography>

      <Grid container spacing={3}>
        {plan.map((month, monthIndex) => (
          <Grid item xs={12} key={month.month}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{month.month}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    Progress: {calculateProgress(monthIndex)}%
                  </Typography>
                </Box>

                <List>
                  {month.weeks.map((week, weekIndex) => (
                    <React.Fragment key={week.week}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ mr: 1, fontSize: 'small' }} />
                              {week.week}
                            </Box>
                          }
                        />
                      </ListItem>
                      {week.topics.map((topic, topicIndex) => (
                        <ListItem
                          key={topic}
                          button
                          onClick={() =>
                            handleTopicToggle(monthIndex, weekIndex, topicIndex)
                          }
                        >
                          <ListItemIcon>
                            {week.completed[topicIndex] ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <UncheckedIcon />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={topic} />
                        </ListItem>
                      ))}
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary">
          Download Study Plan
        </Button>
      </Box>
    </Container>
  );
}

export default StudyPlan; 