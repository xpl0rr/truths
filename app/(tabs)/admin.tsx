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
  } = useLessons();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const allLessons = getAllLessons();
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
      <View style={{ flex: 1, paddingBottom: 24 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={textStyles.title}>Admin</Text>
          </View>

          <TouchableOpacity onPress={() => setShowAddModal(true)} style={{marginTop: 20}}>
            <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#000', textAlign: 'center', marginVertical: 6 }}>+ Add Your Wisdom</Text>
          </TouchableOpacity>
          
          <View style={styles.backupSection}>
            <Text style={styles.sectionTitle}>Data Backup & Restore</Text>
            <View style={styles.backupButtons}>
              <TouchableOpacity 
                style={[styles.backupButton, isExporting && styles.disabledButton]} 
                onPress={handleExport}
                disabled={isExporting || isImporting}
              >
                {isExporting ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={18} color="#007AFF" />
                    <Text style={styles.backupButtonText}>Export Data</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.backupButton, isImporting && styles.disabledButton]} 
                onPress={handleImport}
                disabled={isExporting || isImporting}
              >
                {isImporting ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <>
                    <Ionicons name="cloud-download-outline" size={18} color="#007AFF" />
                    <Text style={styles.backupButtonText}>Import Data</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <TextInput
              style={[styles.search, { paddingRight: 36, height: 44 }]}
              placeholder="Search wisdom..."
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

          {filtered.length === 0 && searchQuery.length > 0 ? (
            <Text style={textStyles.body}>No matches found.</Text>
          ) : filtered.length === 0 ? (
            <Text style={textStyles.body}>No wisdom yet.</Text>
          ) : (
            filtered.map((lesson) => (
              <View key={lesson.id} style={styles.card}>
                <Text style={{ fontSize: 16, fontWeight: '400', color: '#222' }}>{lesson.lesson}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                  {!lesson.isApproved && (
                    <TouchableOpacity onPress={() => approveLesson(lesson.id)} style={{ marginRight: 16 }}>
                      <Ionicons name="checkmark-circle-outline" size={24} color="#4caf50" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => startEditing(lesson)} style={{ marginRight: 16 }}>
                    <Ionicons name="pencil-outline" size={24} color="#007aff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteLesson(lesson.id)}>
                    <Ionicons name="trash-outline" size={24} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
