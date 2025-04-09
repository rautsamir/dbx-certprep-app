import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  RestartAlt as ResetIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();

  // Settings state
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');

  // Profile data (you would typically get this from your auth system)
  const profileData = {
    name: 'User',
    email: 'user@example.com',
    joinDate: new Date().toLocaleDateString(),
    completedModules: 3,
    quizzesTaken: 5,
    averageScore: '78%'
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    setProfileDialogOpen(true);
  };

  const handleSettingsClick = () => {
    handleProfileMenuClose();
    setSettingsDialogOpen(true);
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    // Clear all auth data
    localStorage.clear();
    setLogoutDialogOpen(false);
    // Redirect to home page
    navigate('/');
    window.location.reload();
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
    // You would typically handle theme change here
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    localStorage.setItem('notifications', (!notifications).toString());
  };

  const handleResetClick = () => {
    handleProfileMenuClose();
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    // Reset all progress data from localStorage
    const keysToKeep = ['user_settings']; // Add any keys you want to preserve
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    setResetDialogOpen(false);
    window.location.reload(); // Reload the page to reflect changes
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { name: 'Learning', path: '/learning', icon: <SchoolIcon /> },
    { name: 'Quiz', path: '/quiz', icon: <QuizIcon /> },
    { name: 'Progress', path: '/progress', icon: <AssessmentIcon /> },
    { name: 'Study Plan', path: '/study-plan', icon: <CalendarIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          DBX Quiz App
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.name}
            component={RouterLink}
            to={item.path}
            selected={isActive(item.path)}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: '0 24px 24px 0',
              mr: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 120, 255, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 120, 255, 0.12)',
                },
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
                '& .MuiListItemText-primary': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 250px)` },
          ml: { md: '250px' },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  mr: 1,
                }}
              >
                DBX
              </Box>
              Quiz App
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    mx: 1,
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 120, 255, 0.08)',
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                <PersonIcon />
              </Avatar>
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSettingsClick}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleResetClick}>
                <ListItemIcon>
                  <ResetIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Reset Progress</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.05)',
            backgroundColor: 'background.paper',
            height: '100vh',
            top: 0,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h6">{profileData.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.email}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="body2">
                <strong>Member since:</strong> {profileData.joinDate}
              </Typography>
              <Typography variant="body2">
                <strong>Completed Modules:</strong> {profileData.completedModules}
              </Typography>
              <Typography variant="body2">
                <strong>Quizzes Taken:</strong> {profileData.quizzesTaken}
              </Typography>
              <Typography variant="body2">
                <strong>Average Score:</strong> {profileData.averageScore}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setProfileDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DarkModeIcon />
                  <Typography>Dark Mode</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={handleNotificationsToggle}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon />
                  <Typography>Notifications</Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSettingsDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? You will need to sign in again to access your progress.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleResetCancel}
        aria-labelledby="reset-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle id="reset-dialog-title" sx={{ pb: 1 }}>
          Reset All Progress?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will reset all your learning progress, quiz scores, and study data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleResetCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleResetConfirm}
            variant="contained"
            color="error"
            startIcon={<ResetIcon />}
          >
            Reset Progress
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar; 