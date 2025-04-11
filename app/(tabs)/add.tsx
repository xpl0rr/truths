import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, FlatList, TouchableOpacity, Alert, Button, Modal, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AddLessonForm } from '@/components/AddLessonForm';
import { LessonCard } from '@/components/LessonCard';
import { useLessons } from '../store/LessonStore';
import { FullScreenLesson } from '@/components/FullScreenLesson';

// Debug storage keys
const STORAGE_KEY = 'gramma_lessons_v2';

export default function AddLessonScreen() {
  const { addLesson, voteLesson, getApprovedLessons, saveToStorage, loadFromStorage, clearStorage } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [adminLessons, setAdminLessons] = useState([]);
  const [storageStatus, setStorageStatus] = useState("Checking storage...");
  const [storageKeys, setStorageKeys] = useState([]);

  // Run AsyncStorage test and update status
  useEffect(() => {
    const checkStorage = async () => {
      try {
        // Get all storage keys
        const keys = await AsyncStorage.getAllKeys();
        setStorageKeys(keys);

        // Check for our main data
        if (keys.includes(STORAGE_KEY)) {
          const data = await AsyncStorage.getItem(STORAGE_KEY);
          if (data) {
            const parsed = JSON.parse(data);
            setStorageStatus(`Found ${parsed.length} lessons in storage`);
          } else {
            setStorageStatus("Storage exists but is empty");
          }
        } else {
          setStorageStatus("No lesson storage found");
        }
      } catch (error) {
        setStorageStatus(`Error: ${error.message}`);
      }
    };

    checkStorage();
  }, []);

  // Admin info
  const userId = 'admin1';
  const userName = 'Admin';

  // Fetch admin lessons whenever the screen renders
  useEffect(() => {
    // Get only official admin lessons (not user-submitted approved ones)
    const lessons = getApprovedLessons().filter(
      lesson => !lesson.isUserSubmitted
    );

    console.log(`Found ${lessons.length} admin lessons`);
    setAdminLessons(lessons);
  }, [getApprovedLessons]);

  // SIMPLIFIED DEBUG FUNCTIONS
  const manualCheckStorage = async () => {
    try {
      setStorageStatus("Checking storage...");

      // Direct inspection of AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      setStorageKeys(keys);

      if (keys.includes(STORAGE_KEY)) {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          const adminLessons = parsed.filter(lesson => !lesson.isUserSubmitted);
          const userLessons = parsed.filter(lesson => lesson.isUserSubmitted);

          setStorageStatus(
            `Found ${parsed.length} total lessons\n` +
            `- ${adminLessons.length} admin lessons\n` +
            `- ${userLessons.length} user lessons`
          );

          // Show details in an alert
          Alert.alert(
            "Storage Data",
            `Found ${parsed.length} lessons:\n\n` +
            `Admin lessons: ${adminLessons.length}\n` +
            `User lessons: ${userLessons.length}\n\n` +
            `First lesson: "${parsed[0]?.lesson || 'none'}"\n` +
            `Storage size: ${data.length} bytes`
          );
        } else {
          setStorageStatus("Storage exists but is empty");
          Alert.alert("Storage Empty", "Storage key exists but has no data");
        }
      } else {
        setStorageStatus("No lesson storage found");
        Alert.alert("Storage Empty", "No data found for lessons");
      }
    } catch (error) {
      setStorageStatus(`Error: ${error.message}`);
      Alert.alert("Error", "Failed to check storage: " + error.message);
    }
  };

  const manualClearStorage = async () => {
    try {
      setStorageStatus("Clearing storage...");
      await AsyncStorage.clear();
      setStorageStatus("Storage cleared successfully");
      setStorageKeys([]);

      Alert.alert("Storage Cleared", "All storage has been reset");
      // Force reload app data
      await loadFromStorage();
      // Update adminLessons
      const lessons = getApprovedLessons().filter(
        lesson => !lesson.isUserSubmitted
      );
      setAdminLessons(lessons);
    } catch (error) {
      setStorageStatus(`Clear error: ${error.message}`);
      Alert.alert("Error", "Failed to clear storage: " + error.message);
    }
  };

  const manualSaveLesson = async (lesson, anecdote) => {
    try {
      if (!lesson || !anecdote) {
        Alert.alert("Error", "Please provide both lesson and anecdote");
        return;
      }

      console.log("Manually saving lesson:", lesson);
      console.log("Anecdote:", anecdote);
      setStorageStatus("Saving lesson...");

      // Create the lesson with admin attributes
      const newLesson = {
        id: Date.now().toString(),
        lesson: lesson.trim(),
        anecdote: anecdote,
        upvotes: 0,
        downvotes: 0,
        voters: {},
        createdAt: new Date().toISOString(), // Convert to string for storage
        userId,
        userName,
        isUserSubmitted: false,
        isApproved: true,
        approvalThreshold: 10
      };

      // Get current storage data
      let currentData = [];
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        currentData = JSON.parse(storedData);
        console.log(`Found ${currentData.length} existing lessons in storage`);
      }

      // Add new lesson
      const updatedData = [newLesson, ...currentData];

      // Convert to string and save
      const jsonValue = JSON.stringify(updatedData);
      console.log(`Saving ${updatedData.length} lessons (${jsonValue.length} bytes)`);

      try {
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log("AsyncStorage.setItem completed successfully");
        setStorageStatus(`Saved successfully! ${updatedData.length} lessons in storage.`);
      } catch (err) {
        console.error("AsyncStorage.setItem failed:", err);
        setStorageStatus(`Storage error: ${err.message}`);
        throw err;
      }

      // Update storage keys
      const keys = await AsyncStorage.getAllKeys();
      setStorageKeys(keys);

      // Show success and reload
      Alert.alert("Success", `Lesson saved directly to storage (total: ${updatedData.length})`, [
        {
          text: "OK", onPress: async () => {
            await loadFromStorage();
            const updatedLessons = getApprovedLessons().filter(
              lesson => !lesson.isUserSubmitted
            );
            setAdminLessons(updatedLessons);
          }
        }
      ]);
    } catch (error) {
      console.error("Error in manualSaveLesson:", error);
      Alert.alert("Error", "Failed to save lesson: " + error.message);
      setStorageStatus(`Save failed: ${error.message}`);
    }
  };

  // Add a function to update an existing lesson
  const manualUpdateLesson = async (lessonId, updatedTitle, updatedAnecdote) => {
    try {
      if (!updatedTitle || !updatedAnecdote) {
        Alert.alert("Error", "Please provide both lesson title and anecdote");
        return;
      }

      console.log("Updating lesson:", lessonId);
      console.log("New title:", updatedTitle);
      console.log("New anecdote:", updatedAnecdote);
      setStorageStatus("Updating lesson...");

      // Get current storage data
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedData) {
        Alert.alert("Error", "No lessons found in storage");
        return;
      }

      const allLessons = JSON.parse(storedData);

      // Find and update the lesson
      const updatedLessons = allLessons.map(lesson => {
        if (lesson.id === lessonId) {
          return {
            ...lesson,
            lesson: updatedTitle.trim(),
            anecdote: updatedAnecdote,
            // Keep the rest of the properties unchanged
          };
        }
        return lesson;
      });

      // Convert to string and save
      const jsonValue = JSON.stringify(updatedLessons);
      console.log(`Saving ${updatedLessons.length} lessons (${jsonValue.length} bytes)`);

      try {
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log("AsyncStorage.setItem completed successfully");
        setStorageStatus(`Updated successfully! ${updatedLessons.length} lessons in storage.`);
      } catch (err) {
        console.error("AsyncStorage.setItem failed:", err);
        setStorageStatus(`Storage error: ${err.message}`);
        throw err;
      }

      // Update storage keys
      const keys = await AsyncStorage.getAllKeys();
      setStorageKeys(keys);

      // Show success and reload
      Alert.alert("Success", "Lesson updated successfully", [
        {
          text: "OK", onPress: async () => {
            await loadFromStorage();
            const refreshedLessons = getApprovedLessons().filter(
              lesson => !lesson.isUserSubmitted
            );
            setAdminLessons(refreshedLessons);
          }
        }
      ]);

      return true;
    } catch (error) {
      console.error("Error in manualUpdateLesson:", error);
      Alert.alert("Error", "Failed to update lesson: " + error.message);
      setStorageStatus(`Update failed: ${error.message}`);
      return false;
    }
  };

  // Handle the submission of a new lesson from the form
  const handleSubmitNewLesson = (lesson, anecdote) => {
    manualSaveLesson(lesson, anecdote);
  };

  const handleVote = (lessonId: string, userId: string, voteType: 'up' | 'down' | null) => {
    voteLesson(lessonId, userId, voteType);

    // Refresh the admin lessons list after voting
    const updatedLessons = getApprovedLessons().filter(
      lesson => !lesson.isUserSubmitted
    );
    setAdminLessons(updatedLessons);

    // Force save after vote
    saveToStorage();
  };

  const handleOpenLesson = (lesson) => {
    console.log("Opening admin lesson:", lesson.lesson);
    console.log("Admin anecdote length:", lesson.anecdote.length);
    setSelectedLesson(lesson);
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
  };

  const renderLessonCard = ({ item }) => (
    <LessonCard
      lesson={item}
      userId={userId}
      onVote={handleVote}
      onSelect={handleOpenLesson}
    />
  );

  // Show full screen lesson if one is selected
  if (selectedLesson) {
    return (
      <FullScreenLesson
        lesson={selectedLesson}
        onClose={handleCloseLesson}
        userId={userId}
        userName={userName}
        isAdmin={true}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.titleText}>Admin: Manage Lessons</ThemedText>
      </View>

      {/* Main content without any padding or scrolling */}
      <View style={{ flex: 1, width: '100%' }}>
        {/* Manage Existing Lessons Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#F44336',
            paddingVertical: 8,
            borderRadius: 0, // No rounded corners
            alignItems: 'center',
            width: '100%',
          }}
          onPress={() => {
            // Get the latest approved lessons
            const lessons = getApprovedLessons();

            // Show modal to manage lessons
            Alert.alert(
              "Manage Lessons",
              `Found ${lessons.length} lessons. What would you like to do?`,
              [
                { text: "Close", style: "cancel" },
                {
                  text: "View & Manage Lessons",
                  onPress: () => {
                    // For each lesson, create an alert with multiple management options
                    if (lessons.length === 0) {
                      Alert.alert("No Lessons", "There are no lessons to manage.");
                      return;
                    }

                    const showNextLesson = (index = 0) => {
                      if (index >= lessons.length) {
                        // When done with all lessons, show a completion message with option to exit
                        Alert.alert(
                          "Management Complete",
                          "You've reviewed all lessons.",
                          [{ text: "Close", style: "default" }]
                        );
                        return;
                      }

                      const lesson = lessons[index];

                      // Show the lesson with management options
                      Alert.alert(
                        `${index + 1}/${lessons.length}: ${lesson.lesson}`,
                        `Added by: ${lesson.userName}`,
                        [
                          { text: "Skip", onPress: () => showNextLesson(index + 1) },
                          { text: "Exit", style: "cancel" },
                          {
                            text: "Edit",
                            onPress: () => {
                              // First, show current title for editing
                              Alert.prompt(
                                "Edit Lesson Title",
                                "Update the lesson title:",
                                [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Next",
                                    onPress: async (updatedTitle) => {
                                      if (!updatedTitle || updatedTitle.trim().length === 0) {
                                        Alert.alert("Error", "Title cannot be empty");
                                        return;
                                      }

                                      // Then prompt for anecdote edit
                                      Alert.prompt(
                                        "Edit Anecdote",
                                        "Update the anecdote:",
                                        [
                                          { text: "Cancel", style: "cancel" },
                                          {
                                            text: "Save Changes",
                                            onPress: async (updatedAnecdote) => {
                                              if (!updatedAnecdote || updatedAnecdote.trim().length < 10) {
                                                Alert.alert("Error", "Anecdote must be at least 10 characters");
                                                return;
                                              }

                                              // Update the lesson
                                              const success = await manualUpdateLesson(
                                                lesson.id,
                                                updatedTitle,
                                                updatedAnecdote
                                              );

                                              if (success) {
                                                // Continue with next lesson
                                                showNextLesson(index + 1);
                                              }
                                            }
                                          }
                                        ],
                                        "plain-text",
                                        lesson.anecdote,
                                        "default"
                                      );
                                    }
                                  }
                                ],
                                "plain-text",
                                lesson.lesson,
                                "default"
                              );
                            }
                          },
                          {
                            text: "View",
                            onPress: () => {
                              // Show the full content of the lesson
                              Alert.alert(
                                lesson.lesson,
                                lesson.anecdote,
                                [
                                  {
                                    text: "Back to Management",
                                    onPress: () => {
                                      // Go back to the management options for this lesson
                                      Alert.alert(
                                        `${index + 1}/${lessons.length}: ${lesson.lesson}`,
                                        `Added by: ${lesson.userName}`,
                                        [
                                          { text: "Skip", onPress: () => showNextLesson(index + 1) },
                                          {
                                            text: "Edit", style: "default", onPress: () => {
                                              // Copy the edit functionality from above
                                              Alert.prompt(
                                                "Edit Lesson Title",
                                                "Update the lesson title:",
                                                [
                                                  { text: "Cancel", style: "cancel" },
                                                  {
                                                    text: "Next",
                                                    onPress: async (updatedTitle) => {
                                                      if (!updatedTitle || updatedTitle.trim().length === 0) {
                                                        Alert.alert("Error", "Title cannot be empty");
                                                        return;
                                                      }

                                                      // Then prompt for anecdote edit
                                                      Alert.prompt(
                                                        "Edit Anecdote",
                                                        "Update the anecdote:",
                                                        [
                                                          { text: "Cancel", style: "cancel" },
                                                          {
                                                            text: "Save Changes",
                                                            onPress: async (updatedAnecdote) => {
                                                              if (!updatedAnecdote || updatedAnecdote.trim().length < 10) {
                                                                Alert.alert("Error", "Anecdote must be at least 10 characters");
                                                                return;
                                                              }

                                                              // Update the lesson
                                                              const success = await manualUpdateLesson(
                                                                lesson.id,
                                                                updatedTitle,
                                                                updatedAnecdote
                                                              );

                                                              if (success) {
                                                                // Continue with next lesson
                                                                showNextLesson(index + 1);
                                                              }
                                                            }
                                                          }
                                                        ],
                                                        "plain-text",
                                                        lesson.anecdote,
                                                        "default"
                                                      );
                                                    }
                                                  }
                                                ],
                                                "plain-text",
                                                lesson.lesson,
                                                "default"
                                              );
                                            }
                                          },
                                          {
                                            text: "Delete", style: "destructive", onPress: async () => {
                                              try {
                                                // Get current storage
                                                const data = await AsyncStorage.getItem(STORAGE_KEY);
                                                if (!data) return;

                                                // Parse and filter out the lesson to delete
                                                const allLessons = JSON.parse(data);
                                                const updatedLessons = allLessons.filter(l => l.id !== lesson.id);

                                                // Save back to storage
                                                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLessons));

                                                // Reload data
                                                await loadFromStorage();

                                                Alert.alert("Success", "Lesson deleted successfully");

                                                // Continue with next lesson
                                                showNextLesson(index + 1);
                                              } catch (error) {
                                                Alert.alert("Error", "Failed to delete lesson: " + error.message);
                                              }
                                            }
                                          }
                                        ]
                                      );
                                    }
                                  }
                                ]
                              );
                            }
                          },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: async () => {
                              // Delete the lesson directly from storage
                              try {
                                // Get current storage
                                const data = await AsyncStorage.getItem(STORAGE_KEY);
                                if (!data) return;

                                // Parse and filter out the lesson to delete
                                const allLessons = JSON.parse(data);
                                const updatedLessons = allLessons.filter(l => l.id !== lesson.id);

                                // Save back to storage
                                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLessons));

                                // Reload data
                                await loadFromStorage();

                                Alert.alert("Success", "Lesson deleted successfully");

                                // Continue with next lesson
                                showNextLesson(index + 1);
                              } catch (error) {
                                Alert.alert("Error", "Failed to delete lesson: " + error.message);
                              }
                            }
                          }
                        ]
                      );
                    };

                    showNextLesson();
                  }
                },
                {
                  text: "Check Storage Status",
                  onPress: manualCheckStorage
                },
                {
                  text: "Reset All Data",
                  style: "destructive",
                  onPress: () => {
                    Alert.alert(
                      "Confirm Reset",
                      "Are you sure you want to clear all data? This cannot be undone.",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Reset Everything", style: "destructive", onPress: manualClearStorage }
                      ]
                    );
                  }
                }
              ]
            );
          }}
        >
          <ThemedText style={{ color: 'white', fontSize: 14, fontWeight: 'normal' }}>
            Manage Lessons
          </ThemedText>
        </TouchableOpacity>

        {/* Add the lesson form directly in the UI */}
        <AddLessonForm
          onSubmit={handleSubmitNewLesson}
          adminMode={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'normal',
  },
  adminBanner: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 67, 54, 0.3)',
  },
  adminText: {
    fontSize: 12,
    color: '#F44336',
    textAlign: 'center',
  },
  content: {
    padding: 0,
    marginTop: 0,
  },
  debugContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    padding: 8,
  },
  existingLessonsHeader: {
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  lessonsList: {
    padding: 4,
  },
  emptyState: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 12,
  },
  // Full screen styles
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#A1CEDC',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  fullScreenContent: {
    padding: 16,
  },
  fullScreenTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  fullScreenAnecdoteContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  fullScreenAnecdote: {
    fontSize: 16,
    lineHeight: 24,
  },
  debugText: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    borderRadius: 4,
  },
  plainDebugContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
    padding: 8,
    gap: 8,
  },
  plainButton: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 100,
    alignItems: 'center',
  },
  plainButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  storageStatusContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  storageStatusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  },
  storageStatusText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  refreshButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
    alignSelf: 'center',
  },
  refreshButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  manageButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 0,
    marginVertical: 0,
    marginBottom: 0,
    width: '100%',
  },
  manageButtonText: {
    color: 'white',
    fontWeight: 'normal',
    fontSize: 14,
  },
  scrollContent: {
    padding: 0,
    paddingTop: 0,
    width: '100%',
  },
  mainContent: {
    padding: 16,
  },
  button: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'normal',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  lessonsListContainer: {
    flex: 1,
    marginTop: 8,
  },
  lessonItemPreview: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  lessonItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lessonItemNumber: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#333',
  },
  lessonItemTitle: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonItemAnecdote: {
    color: '#666',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    paddingLeft: 4,
  },
}); 