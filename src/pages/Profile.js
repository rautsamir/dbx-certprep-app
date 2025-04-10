import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  TextField,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  // Mock data - in real app, this would come from your state management
  const [userProfile, setUserProfile] = useState({
    name: 'Samir',
    email: 'samir88@gmail.com',
    completedModules: 0,
    totalModules: 50,
    quizzesTaken: 0,
    averageScore: 0,
    memberSince: '2024-04-09',
    streak: 0,
  });

  React.useEffect(() => {
    // Check if we should open edit mode from navigation state
    if (location.state?.openEdit) {
      setIsEditing(true);
    }
  }, [location]);

  const handleResetLearning = () => {
    localStorage.clear();
    setResetDialogOpen(false);
    window.location.reload();
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save the profile changes to your backend/state management
  };

  const ProfileView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {userProfile.name[0].toUpperCase()}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {userProfile.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userProfile.email}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const ProfileEdit = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 1,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {userProfile.name[0].toUpperCase()}
            </Avatar>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{ mt: -5, ml: 7 }}
            >
              <input hidden accept="image/*" type="file" />
              <PhotoCameraIcon />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Learning Statistics
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Member Since"
                  secondary={new Date(userProfile.memberSince).toLocaleDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Completed Modules"
                  secondary={`${userProfile.completedModules} / ${userProfile.totalModules}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Quizzes Taken"
                  secondary={userProfile.quizzesTaken}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Average Score"
                  secondary={`${userProfile.averageScore}%`}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Danger Zone
            </Typography>
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setResetDialogOpen(true)}
              variant="outlined"
              fullWidth
            >
              Reset Learning History
            </Button>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {isEditing ? <ProfileEdit /> : <ProfileView />}

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Reset Learning History
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            This will reset all your:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Module progress" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Quiz scores and history" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Learning achievements" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleResetLearning}
            color="error"
            variant="contained"
          >
            Reset Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 