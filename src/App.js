import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { UserProvider } from './context/UserContext';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LearningModules from './pages/LearningModules';
import LearningContent from './pages/LearningContent';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import StudyPlan from './pages/StudyPlan';
import UserProfile from './pages/UserProfile';
import MockTest from './pages/MockTest';
import Profile from './pages/Profile';
import LearningModule from './pages/LearningModule';
import ModuleQuiz from './pages/ModuleQuiz';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0078FF', // Databricks blue
      light: '#3399FF',
      dark: '#0055B3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF3621', // Databricks red
      light: '#FF6B5B',
      dark: '#CC2A1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    success: {
      main: '#00B96B',
      light: '#33C78A',
      dark: '#009455',
    },
    warning: {
      main: '#FFB020',
      light: '#FFC04D',
      dark: '#CC8C19',
    },
    error: {
      main: '#FF3621',
      light: '#FF6B5B',
      dark: '#CC2A1A',
    },
    info: {
      main: '#0078FF',
      light: '#3399FF',
      dark: '#0055B3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: '64px', // Height of the navbar
                ml: { xs: 0, md: '250px' }, // Width of the drawer on desktop
                width: { xs: '100%', md: `calc(100% - 250px)` },
                minHeight: '100vh',
                bgcolor: 'background.default',
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/learning-modules" element={<LearningModules />} />
                <Route path="/learning-content/:topic" element={<LearningContent />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/study-plan" element={<StudyPlan />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/mock-test" element={<MockTest />} />
                <Route path="/mock-exam/:examType" element={<MockTest />} />
                <Route path="/module/:moduleId" element={<LearningModule />} />
                <Route path="/module/:moduleId/quiz" element={<ModuleQuiz />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App; 