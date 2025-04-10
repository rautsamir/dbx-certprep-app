import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Collapse,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const moduleContent = {
  introduction: {
    title: "Introduction to Data Lakehouse Architecture",
    content: `The Data Lakehouse combines the best features of data lakes and data warehouses. 
    It provides data structure and management features similar to data warehouses, directly 
    on the low-cost storage used for data lakes.

    Key Features:
    • ACID transactions
    • Schema enforcement and governance
    • BI support
    • Open storage formats
    • Support for diverse data types
    • Direct data lake access`
  },
  codeExamples: {
    title: "Code Examples",
    examples: [
      {
        title: "Creating a Delta Table",
        code: `# Create a new Delta table
spark.sql("""
CREATE TABLE customer_data (
  id LONG,
  name STRING,
  email STRING,
  signup_date DATE
)
USING DELTA
""")`
      },
      {
        title: "Reading and Writing Data",
        code: `# Write data to Delta table
df.write.format("delta").saveAsTable("customer_data")

# Read data from Delta table
df = spark.table("customer_data")`
      }
    ]
  }
};

const LearningModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  // Track study time
  useEffect(() => {
    setStartTime(Date.now());

    return () => {
      const endTime = Date.now();
      const studyTime = Math.round((endTime - startTime) / 1000 / 60); // Convert to minutes

      // Only record if spent more than 1 minute
      if (studyTime >= 1) {
        const today = new Date().toISOString().split('T')[0];
        const studyStreak = JSON.parse(localStorage.getItem('study_streak') || '[]');
        
        const todayIndex = studyStreak.findIndex(day => day.date === today);
        if (todayIndex >= 0) {
          studyStreak[todayIndex].minutes += studyTime;
        } else {
          studyStreak.push({
            date: today,
            minutes: studyTime
          });
        }

        // Keep only last 30 days
        const recentStreak = studyStreak
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 30);

        localStorage.setItem('study_streak', JSON.stringify(recentStreak));

        // Update activity timestamps
        const activityTimestamps = JSON.parse(localStorage.getItem('activity_timestamps') || '{}');
        activityTimestamps[`${moduleId}_study`] = Date.now();
        localStorage.setItem('activity_timestamps', JSON.stringify(activityTimestamps));
      }
    };
  }, [moduleId]);

  const handleQuizClick = () => {
    navigate(`/module/${moduleId}/quiz`);
  };

  const handleSectionClick = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handlePracticeExercise = (exerciseId) => {
    navigate(`/practice/${moduleId}/${exerciseId}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="h4">{moduleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Typography>
        <Chip icon={<SchoolIcon />} label="Learning" color="primary" />
        <Chip 
          icon={<QuizIcon />} 
          label="Take Quiz" 
          color="secondary"
          onClick={handleQuizClick}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'secondary.dark'
            }
          }}
        />
      </Box>

      <List sx={{ mb: 3 }}>
        <ListItem 
          button 
          onClick={() => handleSectionClick('introduction')}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Introduction" />
          {expandedSection === 'introduction' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={expandedSection === 'introduction'} timeout="auto" unmountOnExit>
          <Paper sx={{ p: 3, ml: 4, mr: 2, my: 1, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              {moduleContent.introduction.title}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {moduleContent.introduction.content}
            </Typography>
          </Paper>
        </Collapse>

        <ListItem 
          button 
          onClick={() => handleSectionClick('codeExamples')}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Code Examples" />
          {expandedSection === 'codeExamples' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={expandedSection === 'codeExamples'} timeout="auto" unmountOnExit>
          <Paper sx={{ p: 3, ml: 4, mr: 2, my: 1, bgcolor: 'background.default' }}>
            {moduleContent.codeExamples.examples.map((example, index) => (
              <Box key={index} sx={{ mb: index < moduleContent.codeExamples.examples.length - 1 ? 3 : 0 }}>
                <Typography variant="h6" gutterBottom>
                  {example.title}
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'common.white',
                      whiteSpace: 'pre',
                      overflowX: 'auto'
                    }}
                  >
                    {example.code}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Paper>
        </Collapse>

        <ListItem 
          button 
          onClick={handleQuizClick}
          sx={{ 
            '&:hover': {
              backgroundColor: 'primary.light',
              '& .MuiListItemIcon-root': {
                color: 'primary.main'
              }
            }
          }}
        >
          <ListItemIcon>
            <QuizIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Quiz" 
            primaryTypographyProps={{
              color: 'primary'
            }}
          />
        </ListItem>
      </List>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Practice Exercises
        </Typography>
        <List>
          <ListItem 
            button 
            onClick={() => handlePracticeExercise('compare-warehouse')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Compare traditional data warehouse vs lakehouse architecture" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handlePracticeExercise('use-cases')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Identify use cases for data lakehouse" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handlePracticeExercise('delta-lake')}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Explain Delta Lake benefits" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default LearningModule; 