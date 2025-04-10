import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Progress() {
  const getPerformanceData = () => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    const quizResults = JSON.parse(localStorage.getItem('module_quiz_results') || '{}');
    
    return modules.map(module => {
      const moduleId = module.topics[0]?.name.toLowerCase().replace(/\s+/g, '-');
      const moduleQuizzes = quizResults[moduleId]?.attempts || [];
      const latestQuizScore = moduleQuizzes.length > 0 
        ? moduleQuizzes[moduleQuizzes.length - 1].percentage 
        : 0;

      return {
        topic: module.title.replace(/^\d+\.\s+/, ''),
        score: latestQuizScore,
        questions: moduleQuizzes.length > 0 ? moduleQuizzes[0].totalQuestions : 0,
        progress: module.topics.filter(topic => topic.status === 'completed').length / module.topics.length * 100,
        attempts: moduleQuizzes.length
      };
    });
  };

  const getStudyStreak = () => {
    return JSON.parse(localStorage.getItem('study_streak') || '[]');
  };

  const calculateOverallProgress = () => {
    const modules = JSON.parse(localStorage.getItem('learning_modules') || '[]');
    if (modules.length === 0) return 0;
    const totalTopics = modules.reduce((acc, module) => acc + module.topics.length, 0);
    const completedTopics = modules.reduce((acc, module) => 
      acc + module.topics.filter(topic => topic.status === 'completed').length, 0);
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const calculateTotalStudyTime = () => {
    const studyStreak = getStudyStreak();
    return studyStreak.reduce((acc, curr) => acc + curr.minutes, 0);
  };

  const performanceData = getPerformanceData();
  const studyStreak = getStudyStreak();
  const overallProgress = calculateOverallProgress();
  const totalStudyTime = calculateTotalStudyTime();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Progress
      </Typography>

      <Grid container spacing={3}>
        {/* Overall Progress Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={overallProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="h6">
                  {overallProgress}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Study Time: {totalStudyTime} minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Study Streak Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Study Streak
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studyStreak}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="minutes" fill="#1976d2" name="Study Minutes" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Topic Performance
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Topic</TableCell>
                      <TableCell align="right">Quiz Score (%)</TableCell>
                      <TableCell align="right">Questions Attempted</TableCell>
                      <TableCell align="right">Progress</TableCell>
                      <TableCell align="right">Quiz Attempts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performanceData.map((row) => (
                      <TableRow key={row.topic}>
                        <TableCell component="th" scope="row">
                          {row.topic}
                        </TableCell>
                        <TableCell align="right">{Math.round(row.score)}%</TableCell>
                        <TableCell align="right">{row.questions}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100px', mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={row.progress}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography variant="body2">
                              {Math.round(row.progress)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.attempts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Progress; 