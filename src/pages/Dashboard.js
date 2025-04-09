import React from 'react';
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
import { Link as RouterLink } from 'react-router-dom';

function Dashboard() {
  const theme = useTheme();

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

  const calculateQuizScore = () => {
    const score = localStorage.getItem('quiz_score');
    const completedQuestions = JSON.parse(localStorage.getItem('quiz_completed_questions') || '[]');
    if (!score || completedQuestions.length === 0) return '0%';
    return `${Math.round((parseInt(score) / completedQuestions.length) * 100)}%`;
  };

  const calculateStudyHours = () => {
    const studyStreak = JSON.parse(localStorage.getItem('study_streak') || '[]');
    const totalMinutes = studyStreak.reduce((acc, day) => acc + day.minutes, 0);
    return `${Math.round(totalMinutes / 60)}h`;
  };

  const calculateModuleProgress = (moduleName) => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    const module = modules.find(m => m.title.includes(moduleName));
    if (!module) return 0;
    
    const totalTopics = module.topics.length;
    const completedTopics = module.topics.filter(topic => topic.status === 'completed').length;
    return Math.round((completedTopics / totalTopics) * 100);
  };

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

  const getRecentActivities = () => {
    const activities = [];
    
    // Check learning modules
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    modules.forEach(module => {
      module.topics.forEach(topic => {
        if (topic.status === 'completed') {
          activities.push({
            title: `Completed ${topic.name}`,
            date: 'Recently',
            icon: <CheckCircleIcon sx={{ color: theme.palette.success.main }} />,
          });
        } else if (topic.status === 'in-progress') {
          activities.push({
            title: `Started ${topic.name}`,
            date: 'Recently',
            icon: <SchoolIcon sx={{ color: theme.palette.info.main }} />,
          });
        }
      });
    });

    // Check quiz progress
    const completedQuestions = JSON.parse(localStorage.getItem('quiz_completed_questions') || '[]');
    if (completedQuestions.length > 0) {
      activities.push({
        title: `Completed ${completedQuestions.length} Quiz Questions`,
        date: 'Recently',
        icon: <QuizIcon sx={{ color: theme.palette.primary.main }} />,
      });
    }

    return activities.slice(0, 3); // Return only the 3 most recent activities
  };

  const recentActivities = getRecentActivities();

  const upcomingTasks = [
    {
      title: 'Complete Spark SQL Quiz',
      due: 'Today',
      completed: false,
    },
    {
      title: 'Review Delta Lake Operations',
      due: 'Tomorrow',
      completed: false,
    },
    {
      title: 'Start Production Pipelines Module',
      due: 'In 2 days',
      completed: false,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: 4,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Welcome back, User!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Continue your journey to becoming a Databricks Certified Data Engineer
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                component={RouterLink}
                to="/learning"
                sx={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
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

        {/* Progress Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Module Progress
              </Typography>
              <Box sx={{ mt: 2 }}>
                {['Databricks Lakehouse Platform', 'ELT with Apache Spark', 'Incremental Data Processing'].map(
                  (module, index) => {
                    const progress = calculateModuleProgress(module);
                    return (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {module}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0, 120, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                    );
                  }
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>{activity.icon}</ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={activity.date}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: 500 },
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          sx: { color: 'text.secondary' },
                        }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Upcoming Tasks
              </Typography>
              <List>
                {upcomingTasks.map((task, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {task.completed ? (
                          <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                        ) : (
                          <UncheckedIcon sx={{ color: theme.palette.text.secondary }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={`Due: ${task.due}`}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: 500 },
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          sx: { color: 'text.secondary' },
                        }}
                      />
                    </ListItem>
                    {index < upcomingTasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 