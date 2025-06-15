import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Share, Platform } from 'react-native';

/**
 * Export all AsyncStorage data to a JSON file that can be saved to Files.app
 */
export const exportData = async (): Promise<void> => {
  try {
    // Get all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    
    // Filter out any system keys if needed
    const userKeys = keys.filter(key => 
      key.startsWith('wisdom-') || // Our app's Zustand persisted state
      key === 'wisdom_lessons' ||  // Legacy key format if any
      key === 'wisdom-storage-v2' // Current Zustand key
    );
    
    if (userKeys.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }
    
    // Get all data for the keys
    const keyValuePairs = await AsyncStorage.multiGet(userKeys);
    
    // Create a backup object with metadata
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: keyValuePairs.reduce((obj, [key, value]) => {
        obj[key] = value; // value is already a string
        return obj;
      }, {} as Record<string, string | null>)
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(backupData, null, 2);
    
    // Use consistent filename to allow overwriting
    const fileName = 'wisdom_backup.json';
    
    // Use a more reliable location - the cache directory
    const filePath = FileSystem.cacheDirectory + fileName;
    
    // Check if file exists before writing
    let fileInfo = await FileSystem.getInfoAsync(filePath);
    
    if (fileInfo.exists) {
      // File exists, ask if user wants to overwrite
      try {
        await new Promise((resolve, reject) => {
          Alert.alert(
            'File Exists',
            'A backup file already exists. Do you want to overwrite it?',
            [
              { 
                text: 'Cancel', 
                style: 'cancel',
                onPress: () => reject(new Error('User cancelled overwrite'))
              },
              { 
                text: 'Overwrite', 
                style: 'destructive',
                onPress: async () => {
                  try {
                    // Write the backup data to the file
                    await FileSystem.writeAsStringAsync(filePath, jsonData, {
                      encoding: FileSystem.EncodingType.UTF8
                    });
                    resolve(undefined);
                  } catch (error) {
                    reject(error);
                  }
                }
              }
            ]
          );
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'User cancelled overwrite') {
          console.log('User cancelled overwrite, exiting export function');
          return; // Exit the function early
        }
        // Re-throw other errors
        throw error;
      }
    } else {
      // File doesn't exist, write directly
      await FileSystem.writeAsStringAsync(filePath, jsonData, {
        encoding: FileSystem.EncodingType.UTF8
      });
    }
    
    // Make sure the file exists before sharing
    fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      throw new Error('Failed to create backup file');
    }
    
    // iOS-specific sharing (using file URL format with the file:// prefix)
    if (Platform.OS === 'ios') {
      const shareOptions = {
        url: filePath,
        UTI: 'public.json', // Universal Type Identifier for JSON files
        saveToFiles: true
      };
      
      await Share.share(shareOptions);
    } else {
      // For Android
      await Share.share({
        title: 'Wisdom App Backup',
        message: 'Save this backup file',
        url: 'file://' + filePath
      });
    }
    
    Alert.alert(
      'Backup Created',
      'Please save the file to your Files app by selecting "Save to Files" in the share sheet. You\'ll need this file to restore your data after reinstalling.'
    );
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert(
      'Export Failed',
      'There was an error exporting your data. Please try again.'
    );
  }
};

/**
 * Import AsyncStorage data from a JSON file picked from Files.app
 */
export const importData = async (): Promise<void> => {
  try {
    // Let user select a backup file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });
    
    // Check if user cancelled
    if (result.canceled) {
      return;
    }
    
    const fileUri = result.assets[0].uri;
    
    // Read file content
    const jsonContent = await FileSystem.readAsStringAsync(fileUri);
    
    // Parse the backup data
    const backupData = JSON.parse(jsonContent);
    
    // Validate backup format
    if (!backupData.version || !backupData.data) {
      throw new Error('Invalid backup file format');
    }
    
    // Ask for confirmation before overwriting data
    Alert.alert(
      'Restore Data',
      'This will replace all existing app data with data from the backup file. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear current storage first
              const currentKeys = await AsyncStorage.getAllKeys();
              const appKeys = currentKeys.filter(key => 
                key.startsWith('wisdom-') || 
                key === 'wisdom_lessons' ||
                key === 'wisdom-storage-v2'
              );
              
              if (appKeys.length > 0) {
                await AsyncStorage.multiRemove(appKeys);
              }
              
              // Restore backup data
              for (const [key, value] of Object.entries(backupData.data)) {
                if (value !== null && value !== undefined) {
                  await AsyncStorage.setItem(key, value as string);
                }
              }
              
              console.log('Data restore complete, force reloading app state');
              
              // Force reload app by clearing storage cache in memory
              try {
                // No direct way to clear Zustand's in-memory cache, but we can
                // ensure AsyncStorage is properly written to disk
                await AsyncStorage.flushGetRequests();
                
                Alert.alert(
                  'Restore Complete',
                  'Your data has been successfully restored. The app will now reload.',
                  [
                    { 
                      text: 'OK', 
                      onPress: () => {
                        // Force app reload on iOS/Android
                        console.log('Triggering app reload');
                        
                        // RN doesn't have a built-in way to restart the app,
                        // so we'll reload the JS bundle if possible or instruct the user
                        if (Platform.OS === 'ios') {
                          // On iOS we can try to force an error to trigger a refresh
                          setTimeout(() => {
                            console.log('Forcing app refresh...');
                            throw new Error('FORCED_REFRESH_AFTER_IMPORT');
                          }, 500);
                        } else {
                          Alert.alert(
                            'Manual Restart Required',
                            'Please completely close the app (swipe it away) and reopen it to see your imported data.',
                            [{ text: 'OK' }]
                          );
                        }
                      }
                    }
                  ]
                );
              } catch (reloadError) {
                console.error('Error during app reload attempt:', reloadError);
                Alert.alert(
                  'Restart Required',
                  'Please completely close the app (swipe it away) and reopen it to see your imported data.'
                );
              }
            } catch (restoreError) {
              console.error('Restore error:', restoreError);
              Alert.alert(
                'Restore Failed',
                'There was an error restoring your data. Please try again.'
              );
            }
          }
        }
      ]
    );
  } catch (error) {
    console.error('Import error:', error);
    Alert.alert(
      'Import Failed',
      'There was an error importing your data. Please check that you selected a valid backup file.'
    );
  }
};
