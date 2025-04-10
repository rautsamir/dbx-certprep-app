import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const UserProfile = () => {
  const location = useLocation();
  const { userProfile, updateUserProfile } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(location.state?.openEdit || false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    if (location.state?.openEdit) {
      handleEditClick();
    }
  }, [location.state]);

  const handleEditClick = () => {
    setEditedProfile({ ...userProfile });
    setIsEditDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updatedProfile = { ...userProfile, ...editedProfile };
    updateUserProfile(updatedProfile);
    setIsEditDialogOpen(false);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
          <IconButton 
            onClick={handleEditClick}
            color="primary"
            size="large"
          >
            <EditIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 2 }}
            >
              {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5">{userProfile.name}</Typography>
              <Typography color="text.secondary">{userProfile.email}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Member since"
                  secondary={userProfile.memberSince}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Completed Modules"
                  secondary={userProfile.completedModules}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Quizzes Taken"
                  secondary={userProfile.quizzesTaken}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Average Score"
                  secondary={`${userProfile.averageScore}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Certification Status"
                  secondary={userProfile.certificationStatus}
                />
              </ListItem>
              {userProfile.targetDate && (
                <ListItem>
                  <ListItemText 
                    primary="Target Certification Date"
                    secondary={new Date(userProfile.targetDate).toLocaleDateString()}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Profile
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editedProfile.name || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editedProfile.email || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={editedProfile.company || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Certification Status</InputLabel>
                <Select
                  name="certificationStatus"
                  value={editedProfile.certificationStatus || ''}
                  onChange={handleChange}
                  label="Certification Status"
                >
                  {['Not Started', 'In Progress', 'Planning to Take', 'Failed - Retaking', 'Certified'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Certification Date"
                name="targetDate"
                type="date"
                value={editedProfile.targetDate || ''}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile; 