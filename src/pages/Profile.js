import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { userProfile, updateUserProfile } = useUser();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });

  const handleOpenEditDialog = () => {
    setEditForm({
      name: userProfile.name || '',
      email: userProfile.email || ''
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      ...userProfile,
      name: editForm.name,
      email: editForm.email
    });
    setEditDialogOpen(false);
  };

  const handleResetLearning = () => {
    localStorage.clear();
    setResetDialogOpen(false);
    window.location.reload();
  };

  const StatItem = ({ icon: Icon, label, value }) => (
    <ListItem>
      <ListItemIcon>
        <Icon color="primary" />
      </ListItemIcon>
      <ListItemText 
        primary={label}
        secondary={value}
        primaryTypography={{ variant: 'subtitle1' }}
        secondaryTypography={{ variant: 'h6' }}
      />
    </ListItem>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Overview */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            {userProfile.name ? userProfile.name[0].toUpperCase() : 'G'}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {userProfile.name || 'Guest'}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {userProfile.email || 'No email set'}
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenEditDialog}
            sx={{ mt: 2 }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Stats Section */}
        <Paper variant="outlined" sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ px: 2, pt: 1 }}>
            Learning Progress
          </Typography>
          <List>
            <StatItem
              icon={HistoryIcon}
              label="Member Since"
              value={new Date(userProfile.memberSince).toLocaleDateString()}
            />
            <StatItem
              icon={SchoolIcon}
              label="Completed Modules"
              value={userProfile.completedModules || 0}
            />
            <StatItem
              icon={TrophyIcon}
              label="Quizzes Taken"
              value={userProfile.quizzesTaken || 0}
            />
            <StatItem
              icon={TimelineIcon}
              label="Average Score"
              value={`${userProfile.averageScore || 0}%`}
            />
          </List>
        </Paper>

        {/* Danger Zone */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mt: 4, 
            border: '1px solid #ff1744',
            bgcolor: 'error.lighter'
          }}
        >
          <Typography variant="h6" gutterBottom color="error">
            Danger Zone
          </Typography>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => setResetDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Reset Learning Progress
          </Button>
        </Paper>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              variant="outlined"
              autoComplete="off"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleInputChange}
              variant="outlined"
              autoComplete="off"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Reset Learning Progress
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
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResetLearning} color="error" variant="contained">
            Reset Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 