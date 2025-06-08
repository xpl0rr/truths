import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import textStyles from '../styles/textStyles';
import { useLessons } from '@/store/lessonStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddWisdomModal from '../components/AddWisdomModal';
import { useRouter } from 'expo-router';
import FullScreenEditLesson from '../../components/FullScreenEditLesson';
import type { Lesson } from '../../src/models/Lesson';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { exportData, importData } from '../../utils/backupRestore';

function DebugLessons() {
  useEffect(() => {
    async function debugPrintLessons() {
      const raw = await AsyncStorage.getItem('wisdom_lessons');
      if (!raw) {
        console.log('No lessons found in storage.');
      } else {
        try {
          const lessons = JSON.parse(raw);
          console.log('Lessons in storage:', lessons);
        } catch (e) {
          console.log('Could not parse lessons:', raw);
        }
      }
    }
    debugPrintLessons();
  }, []);
  return null;
}

export default function AdminScreen() {
  // Debug: show AsyncStorage contents in console
  DebugLessons();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const {
    getAllLessons,
    approveLesson,
    updateLessonText,
    addLesson,
    deleteLesson,
    approveComment,
  } = useLessons();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // State to track which tab is active
  const [activeTab, setActiveTab] = useState<'wisdoms' | 'comments'>('wisdoms');

  const allLessons = getAllLessons();
  
  // Get all pending comments across all lessons
  const pendingComments = allLessons.flatMap(lesson => {
    const comments = lesson.comments || [];
    return comments
      .filter(comment => !comment.isApproved)
      .map(comment => ({
        ...comment,
        lessonId: lesson.id,
        lessonTitle: lesson.lesson
      }));
  });

  // Filter comments by search query if needed
  const filteredComments = searchQuery.trim().length === 0
    ? pendingComments
    : pendingComments.filter(comment => 
        comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Show only unapproved wisdom by default
  const visibleLessons = searchQuery.trim().length === 0
    ? allLessons.filter(
      (l) => typeof l.lesson === 'string' && l.lesson.trim().length > 0 && !l.isApproved
    )
    : allLessons.filter(
      (l) => typeof l.lesson === 'string' && l.lesson.trim().length > 0 && l.lesson.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const startEditing = (lessonObj: Lesson) => {
    setEditingLesson(lessonObj);
  };

  const handleSaveEdit = (lesson: string, anecdote: string) => {
    if (editingLesson) {
      updateLessonText(editingLesson.id, lesson, editingLesson.isApproved, anecdote);
      setEditingLesson(null);
    }
  };

  const handleCloseEdit = () => {
    setEditingLesson(null);
  };

  const notifySuccess = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleAddNew = (input: { lesson: string; anecdote: string }) => {
    console.log('[Admin handleAddNew] received:', input);
    const newId = Date.now().toString();
    addLesson({
      lesson: input.lesson,
      anecdote: input.anecdote,
      id: newId,
      isUserSubmitted: true,
      isApproved: true,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      createdAt: new Date(),
      userId: 'admin',
      userName: 'Admin',
      approvalThreshold: 10,
      comments: [],
    });
    notifySuccess('Wisdom added and promoted to main page');
    setShowAddModal(false);
    router.push('/');
  };

  const filtered =
    searchQuery.trim().length === 0
      ? visibleLessons
      : visibleLessons.filter((l) =>
        l.lesson.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // --- All rendering logic is now inside the function ---
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportData();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await importData();
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { flex: 1, position: 'relative' }]}> 
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={textStyles.title}>Admin</Text>
          </View>

          <TouchableOpacity 
            onPress={() => setShowAddModal(true)} 
            style={{
              marginTop: 20,
              backgroundColor: '#f5f5f5',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#000', textAlign: 'center' }}>+ Add Your Wisdom</Text>
          </TouchableOpacity>
          
          <View style={{ position: 'relative', justifyContent: 'center', marginTop: 16 }}>
            <TextInput
              style={[styles.search, { paddingRight: 36, height: 44 }]}
              placeholder="Search for a Wisdom"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 12, top: 0, height: 44, justifyContent: 'center', alignItems: 'center' }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 22, color: '#999', lineHeight: 24 }}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'wisdoms' && styles.activeTab]}
              onPress={() => setActiveTab('wisdoms')}
            >
              <Text style={styles.tabText}>Pending Wisdoms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
              onPress={() => setActiveTab('comments')}
            >
              <Text style={styles.tabText}>Pending Comments</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchBox}
            placeholder={activeTab === 'wisdoms' ? "Search all wisdom" : "Search pending comments"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            {activeTab === 'wisdoms' ? (
              <>
                <Text style={styles.listHeader}>
                  Pending Wisdom Approval ({filtered.length})
                </Text>

                {filtered.length > 0 ? (
                  filtered.map((item, idx) => (
                    <View key={item.id} style={styles.card}>
                      <View style={styles.cardTop}>
                        <Text style={styles.cardTitle}>
                          {item.lesson}
                        </Text>
                        <Text style={styles.cardMeta}>
                          {new Date(item.createdAt).toLocaleDateString()} - {item.userName}
                        </Text>
                      </View>

                      <View style={styles.cardBottom}>
                        <View style={styles.actions}>
                          <TouchableOpacity
                            style={styles.standardButton}
                            onPress={() => {
                              approveLesson(item.id);
                              notifySuccess('Approved and moved to main page');
                            }}
                          >
                            <Text style={styles.standardButtonText}>Approve</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.standardButton}
                            onPress={() => startEditing(item)}
                          >
                            <Text style={styles.standardButtonText}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.standardButton}
                            onPress={() => {
                              Alert.alert(
                                'Delete Wisdom',
                                'Are you sure you want to delete this? This cannot be undone.',
                                [
                                  { text: 'Cancel' },
                                  {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => {
                                      deleteLesson(item.id);
                                      notifySuccess('Wisdom deleted');
                                    },
                                  },
                                ]
                              );
                            }}
                          >
                            <Text style={styles.standardButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                ) : searchQuery ? (
                  <Text style={styles.emptyText}>No matching wisdom found.</Text>
                ) : (
                  <Text style={styles.emptyText}>No pending submissions.</Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.listHeader}>
                  Pending Comment Approval ({filteredComments.length})
                </Text>

                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <View key={comment.id} style={styles.card}>
                      <View style={styles.cardTop}>
                        <Text style={styles.commentText}>{comment.text}</Text>
                        <Text style={styles.cardMeta}>
                          {new Date(comment.createdAt).toLocaleDateString()} - {comment.userName}
                        </Text>
                        <Text style={styles.commentLessonLink}>
                          On: "{comment.lessonTitle.substring(0, 40)}{comment.lessonTitle.length > 40 ? '...' : ''}"
                        </Text>
                      </View>

                      <View style={styles.cardBottom}>
                        <View style={styles.actions}>
                          <TouchableOpacity
                            style={styles.standardButton}
                            onPress={() => {
                              approveComment(comment.lessonId, comment.id);
                              notifySuccess('Comment approved');
                            }}
                          >
                            <Text style={styles.standardButtonText}>Approve</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.standardButton}
                            onPress={() => {
                              Alert.alert(
                                'Delete Comment',
                                'Are you sure you want to delete this comment? This cannot be undone.',
                                [
                                  { text: 'Cancel' },
                                  {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => {
                                      // Call deleteComment from lessonStore
                                      useLessons.getState().deleteComment(comment.lessonId, comment.id);
                                      notifySuccess('Comment deleted');
                                    },
                                  },
                                ]
                              );
                            }}
                          >
                            <Text style={styles.standardButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                ) : searchQuery ? (
                  <Text style={styles.emptyText}>No matching comments found.</Text>
                ) : (
                  <Text style={styles.emptyText}>No pending comments.</Text>
                )}
              </>
            )}
          </ScrollView>
        </ScrollView>
        
        <View style={styles.bottomButtons}>
          <TouchableOpacity 
            style={[styles.standardButton, isExporting && styles.disabledButton]} 
            onPress={handleExport}
            disabled={isExporting || isImporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={16} color="#000" style={{marginRight: 4}} />
                <Text style={styles.standardButtonText}>Export Data</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.standardButton, isImporting && styles.disabledButton]} 
            onPress={handleImport}
            disabled={isExporting || isImporting}
          >
            {isImporting ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Ionicons name="cloud-download-outline" size={16} color="#000" style={{marginRight: 4}} />
                <Text style={styles.standardButtonText}>Import Data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <AddWisdomModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(input: { lesson: string; anecdote: string }) => {
          console.log('[AddWisdomModal onSubmit] received:', input);
          if (!input.lesson || !input.lesson.trim()) {
            alert('Lesson is required!');
            return;
          }
          handleAddNew(input);
        }}
      />
      {editingLesson && (
        <FullScreenEditLesson
          visible={!!editingLesson}
          lesson={editingLesson}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007aff',
  },
  tabText: {
    fontSize: 16,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 8,
  },
  commentLessonLink: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Fix TypeScript errors by adding missing style definitions
  searchBox: {
    height: 40, 
    borderWidth: 1, 
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  cardTop: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#777',
  },
  cardBottom: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 16, paddingBottom: 32 },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderTopWidth: 0,
  },
  standardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  standardButtonText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000',
    textAlign: 'center',
  },
  titleSearch: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  backupSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  backupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f2ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cce6ff',
    flex: 0.48,
  },
  backupButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  lesson: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    color: '#111',
  },
  search: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 20,
  },
  // Card style is defined above
});
