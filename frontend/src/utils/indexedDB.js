// IndexedDB wrapper for offline lesson caching

const DB_NAME = 'RuralLearnDB';
const DB_VERSION = 1;
const LESSONS_STORE = 'lessons';
const PROGRESS_STORE = 'progress';

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create lessons store if it doesn't exist
      if (!db.objectStoreNames.contains(LESSONS_STORE)) {
        const lessonsStore = db.createObjectStore(LESSONS_STORE, { keyPath: '_id' });
        lessonsStore.createIndex('title', 'title', { unique: false });
        lessonsStore.createIndex('cachedAt', 'cachedAt', { unique: false });
      }

      // Create progress store if it doesn't exist
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        const progressStore = db.createObjectStore(PROGRESS_STORE, { keyPath: 'id', autoIncrement: true });
        progressStore.createIndex('lessonId', 'lessonId', { unique: false });
        progressStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
};

// Cache a lesson
export const cacheLesson = async (lesson) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([LESSONS_STORE], 'readwrite');
    const store = transaction.objectStore(LESSONS_STORE);

    const lessonWithTimestamp = {
      ...lesson,
      cachedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(lessonWithTimestamp);
      
      request.onsuccess = () => {
        console.log('Lesson cached:', lesson._id);
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error caching lesson:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in cacheLesson:', error);
    throw error;
  }
};

// Get a cached lesson by ID
export const getCachedLesson = async (lessonId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([LESSONS_STORE], 'readonly');
    const store = transaction.objectStore(LESSONS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(lessonId);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error getting cached lesson:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getCachedLesson:', error);
    throw error;
  }
};

// Get all cached lessons
export const getAllCachedLessons = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([LESSONS_STORE], 'readonly');
    const store = transaction.objectStore(LESSONS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error getting all cached lessons:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getAllCachedLessons:', error);
    throw error;
  }
};

// Delete a cached lesson
export const deleteCachedLesson = async (lessonId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([LESSONS_STORE], 'readwrite');
    const store = transaction.objectStore(LESSONS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(lessonId);
      
      request.onsuccess = () => {
        console.log('Lesson deleted from cache:', lessonId);
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error deleting cached lesson:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in deleteCachedLesson:', error);
    throw error;
  }
};

// Clear all cached lessons
export const clearAllCachedLessons = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([LESSONS_STORE], 'readwrite');
    const store = transaction.objectStore(LESSONS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('All cached lessons cleared');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error clearing cached lessons:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in clearAllCachedLessons:', error);
    throw error;
  }
};

// Queue progress update for offline sync
export const queueProgressUpdate = async (progressData) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);

    const queuedData = {
      ...progressData,
      synced: false,
      queuedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(queuedData);
      
      request.onsuccess = () => {
        console.log('Progress update queued:', progressData);
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error queuing progress update:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in queueProgressUpdate:', error);
    throw error;
  }
};

// Get all unsynced progress updates
export const getUnsyncedProgress = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const index = store.index('synced');

    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error getting unsynced progress:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getUnsyncedProgress:', error);
    throw error;
  }
};

// Mark progress update as synced
export const markProgressAsSynced = async (id) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          data.syncedAt = new Date().toISOString();
          
          const putRequest = store.put(data);
          
          putRequest.onsuccess = () => {
            console.log('Progress marked as synced:', id);
            resolve();
          };
          
          putRequest.onerror = () => {
            console.error('Error marking progress as synced:', putRequest.error);
            reject(putRequest.error);
          };
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => {
        console.error('Error getting progress for sync:', getRequest.error);
        reject(getRequest.error);
      };
    });
  } catch (error) {
    console.error('Error in markProgressAsSynced:', error);
    throw error;
  }
};

// Delete synced progress updates (cleanup)
export const deleteSyncedProgress = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);
    const index = store.index('synced');

    return new Promise((resolve, reject) => {
      const request = index.openCursor(IDBKeyRange.only(true));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log('Synced progress updates deleted');
          resolve();
        }
      };
      
      request.onerror = () => {
        console.error('Error deleting synced progress:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in deleteSyncedProgress:', error);
    throw error;
  }
};
