import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

const DEFAULT_USER_PROFILE = {
  name: 'User',
  email: 'user@example.com',
  company: '',
  objective: '',
  certificationStatus: 'Not Started',
  targetDate: '',
  memberSince: new Date().toLocaleDateString(),
  completedModules: 0,
  quizzesTaken: 0,
  averageScore: 0
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load profile from localStorage on initial mount
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile');
      // Restore default profile if loading fails
      setUserProfile(DEFAULT_USER_PROFILE);
    }
  }, []);

  const updateUserProfile = (newProfile) => {
    try {
      setUserProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      
      // Create a backup of the profile
      const timestamp = new Date().toISOString();
      localStorage.setItem(`userProfile_backup_${timestamp}`, JSON.stringify(newProfile));
      
      // Keep only the last 5 backups
      const backups = Object.keys(localStorage)
        .filter(key => key.startsWith('userProfile_backup_'))
        .sort()
        .slice(0, -5);
      
      backups.forEach(key => localStorage.removeItem(key));
      
      setError(null);
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update user profile');
    }
  };

  const restoreFromBackup = () => {
    try {
      const backups = Object.keys(localStorage)
        .filter(key => key.startsWith('userProfile_backup_'))
        .sort()
        .reverse();

      if (backups.length > 0) {
        const latestBackup = localStorage.getItem(backups[0]);
        if (latestBackup) {
          const restoredProfile = JSON.parse(latestBackup);
          setUserProfile(restoredProfile);
          localStorage.setItem('userProfile', latestBackup);
          setError(null);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error restoring from backup:', err);
      setError('Failed to restore from backup');
      return false;
    }
  };

  const clearUserData = () => {
    try {
      // Create one final backup before clearing
      const timestamp = new Date().toISOString();
      localStorage.setItem(`userProfile_backup_${timestamp}`, JSON.stringify(userProfile));

      // Clear user-related data
      Object.keys(localStorage).forEach(key => {
        if (!key.startsWith('userProfile_backup_')) {
          localStorage.removeItem(key);
        }
      });

      setUserProfile(DEFAULT_USER_PROFILE);
      setError(null);
    } catch (err) {
      console.error('Error clearing user data:', err);
      setError('Failed to clear user data');
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        userProfile, 
        updateUserProfile, 
        restoreFromBackup, 
        clearUserData,
        error 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 