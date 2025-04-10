import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const theme = useTheme();
  const { userProfile } = useUser();
  const navigate = useNavigate();

  const calculateQuizScore = () => {
    const score = localStorage.getItem('quiz_score');
    const completedQuestions = JSON.parse(localStorage.getItem('quiz_completed_questions') || '[]');
    if (!score || completedQuestions.length === 0) return '0%';
    return `${Math.round((parseInt(score) / completedQuestions.length) * 100)}%`;
  };

  const generateUpcomingTasks = () => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    const tasks = [];
    
    // Find in-progress and not-started topics
    modules.forEach(module => {
      module.topics.forEach(topic => {
        if (topic.status === 'in-progress') {
          tasks.push({
            title: `Complete ${topic.name}`,
            due: 'Today',
            completed: false
          });
        } else if (topic.status === 'not-started' && tasks.length < 3) {
          tasks.push({
            title: `Start ${topic.name}`,
            due: 'This week',
            completed: false
          });
        }
      });
    });

    // If we have less than 3 tasks, add some quiz recommendations
    if (tasks.length < 3) {
      const quizScore = calculateQuizScore();
      if (quizScore < 80) {
        tasks.push({
          title: 'Take Practice Quiz',
          due: 'This week',
          completed: false
        });
      }
    }

    return tasks.slice(0, 3); // Return only 3 tasks
  };

  const [upcomingTasks, setUpcomingTasks] = useState(() => generateUpcomingTasks());

  const calculateOverallProgress = () => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    if (modules.length === 0) return 0;
    const totalTopics = modules.reduce((acc, module) => acc + module.topics.length, 0);
    const completedTopics = modules.reduce((acc, module) => 
      acc + module.topics.filter(topic => topic.status === 'completed').length, 0);
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const calculateModulesCompleted = () => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    const completedModules = modules.filter(module => 
      module.topics.every(topic => topic.status === 'completed')
    ).length;
    return `${completedModules}/${modules.length}`;
  };

  const calculateStudyHours = () => {
    const studyStreak = JSON.parse(localStorage.getItem('study_streak') || '[]');
    const totalMinutes = studyStreak.reduce((acc, day) => acc + day.minutes, 0);
    return `${Math.round(totalMinutes / 60)}h`;
  };

  const calculateModuleProgress = (moduleTitle) => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    const module = modules.find(m => m.title === moduleTitle);
    if (!module) return 0;
    
    const totalSubtopics = module.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0);
    const completedSubtopics = module.topics.reduce((acc, topic) => 
      acc + (topic.completedSubtopics?.filter(Boolean).length || 0), 0);
    
    return Math.round((completedSubtopics / totalSubtopics) * 100);
  };

  const getRecentActivities = () => {
    const activities = [];
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    
    // Track timestamps for activities
    const activityTimestamps = JSON.parse(localStorage.getItem('activity_timestamps') || '{}');
    
    modules.forEach(module => {
      module.topics.forEach(topic => {
        if (topic.status === 'completed') {
          activities.push({
            title: `Completed ${topic.name}`,
            date: activityTimestamps[`${topic.name}_completed`] || 'Recently',
            icon: <CheckCircleIcon sx={{ color: theme.palette.success.main }} />,
            timestamp: activityTimestamps[`${topic.name}_completed`] || Date.now()
          });
        } else if (topic.status === 'in-progress') {
          activities.push({
            title: `Started ${topic.name}`,
            date: activityTimestamps[`${topic.name}_started`] || 'Recently',
            icon: <SchoolIcon sx={{ color: theme.palette.info.main }} />,
            timestamp: activityTimestamps[`${topic.name}_started`] || Date.now()
          });
        }
      });
    });

    // Sort by timestamp and take the 3 most recent
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(({ title, date, icon }) => ({ title, date, icon }));
  };

  const handleTaskToggle = (index) => {
    const updatedTasks = [...upcomingTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      completed: !updatedTasks[index].completed
    };
    setUpcomingTasks(updatedTasks);

    // Update the corresponding topic status in learning modules if it exists
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    const taskTitle = updatedTasks[index].title;
    
    modules.forEach((module, moduleIndex) => {
      module.topics.forEach((topic, topicIndex) => {
        if (taskTitle.includes(topic.name)) {
          const newModules = [...modules];
          newModules[moduleIndex].topics[topicIndex].status = updatedTasks[index].completed ? 'completed' : 'in-progress';
          localStorage.setItem('learning_modules', JSON.stringify(newModules));
        }
      });
    });
  };

  const handleModuleClick = (moduleTitle) => {
    navigate('/learning-modules', { 
      state: { selectedModule: moduleTitle }
    });
  };

  const handleActivityClick = (activity) => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    
    if (activity.title.startsWith('Started') || activity.title.startsWith('Completed')) {
      // Extract the topic name from the activity title
      const topicName = activity.title.split(' ').slice(1).join(' ');
      
      // Find the module that contains this topic
      for (const module of modules) {
        const topic = module.topics.find(t => t.name === topicName);
        if (topic) {
          // Convert topic name to URL-friendly format
          const moduleId = topic.name.toLowerCase().replace(/\s+/g, '-');
          // Navigate to the new module-based learning route
          navigate(`/module/${moduleId}`);
          return;
        }
      }
    } else if (activity.title.includes('Data Lakehouse') || 
               activity.title.includes('Cluster') || 
               activity.title.includes('Data Extraction')) {
      navigate('/learning-modules');
    }
  };

  const moduleProgressItems = [
    {
      title: 'Databricks Lakehouse Platform',
      progress: calculateModuleProgress('1. Databricks Lakehouse Platform')
    },
    {
      title: 'ELT with Apache Spark',
      progress: calculateModuleProgress('2. ELT with Apache Spark')
    },
    {
      title: 'Incremental Data Processing',
      progress: calculateModuleProgress('3. Incremental Data Processing')
    },
    {
      title: 'Production Pipelines',
      progress: calculateModuleProgress('4. Production Pipelines')
    },
    {
      title: 'Data Governance',
      progress: calculateModuleProgress('5. Data Governance')
    }
  ];

  const recentActivities = getRecentActivities();

  const stats = [
    {
      title: 'Overall Progress',
      value: `${calculateOverallProgress()}%`,
      icon: <AssessmentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Modules Completed',
      value: calculateModulesCompleted(),
      icon: <SchoolIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Quiz Score',
      value: calculateQuizScore(),
      icon: <QuizIcon sx={{ fontSize: 40, color: '#00BFA5' }} />,
      color: '#00BFA5',
    },
    {
      title: 'Study Hours',
      value: calculateStudyHours(),
      icon: <CalendarIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FF9800',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              borderRadius: 2,
              mb: 4,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome back, {userProfile.name}!
            </Typography>
            <Typography variant="subtitle1">
              Continue your journey to becoming a Databricks Certified Data Engineer
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/learning-modules"
              sx={{
                mt: 2,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Continue Learning
            </Button>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ 
                      ml: 2, 
                      fontWeight: 700, 
                      color: stat.color,
                      fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Module Progress Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Module Progress
              </Typography>
              <List>
                {moduleProgressItems.map((item, index) => (
                  <ListItem 
                    key={index}
                    button
                    onClick={() => handleModuleClick(item.title)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1" color="text.secondary">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.progress} 
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem 
                    key={index}
                    button
                    onClick={() => handleActivityClick(activity)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                      borderRadius: 1,
                      mb: 0.5
                    }}
                  >
                    <ListItemIcon>{activity.icon}</ListItemIcon>
                    <ListItemText 
                      primary={activity.title}
                      secondary={activity.date} 
                    />
                  </ListItem>
                ))}
                {recentActivities.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="No recent activity"
                      secondary="Start learning to see your progress here" 
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Tasks
              </Typography>
              <List>
                {upcomingTasks.map((task, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleTaskToggle(index)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      {task.completed ? 
                        <CheckCircleIcon color="success" /> : 
                        <UncheckedIcon />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary={task.title}
                      secondary={`Due: ${task.due}`}
                      sx={{
                        '& .MuiTypography-root': {
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 