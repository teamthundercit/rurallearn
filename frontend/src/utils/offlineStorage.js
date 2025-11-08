/**
 * Offline Storage using IndexedDB
 * Stores lessons, progress, and user data for offline access
 */

const DB_NAME = 'EduAdaptDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  LESSONS: 'lessons',
  PROGRESS: 'progress',
  USER_DATA: 'userData',
  PENDING_SYNC: 'pendingSync'
};

let db = null;

/**
 * Initialize IndexedDB
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB initialized successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create lessons store
      if (!database.objectStoreNames.contains(STORES.LESSONS)) {
        const lessonsStore = database.createObjectStore(STORES.LESSONS, { keyPath: '_id' });
        lessonsStore.createIndex('category', 'category', { unique: false });
        lessonsStore.createIndex('language', 'language', { unique: false });
      }

      // Create progress store
      if (!database.objectStoreNames.contains(STORES.PROGRESS)) {
        const progressStore = database.createObjectStore(STORES.PROGRESS, { keyPath: 'id', autoIncrement: true });
        progressStore.createIndex('lessonId', 'lessonId', { unique: false });
        progressStore.createIndex('userId', 'userId', { unique: false });
        progressStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Create user data store
      if (!database.objectStoreNames.contains(STORES.USER_DATA)) {
        database.createObjectStore(STORES.USER_DATA, { keyPath: 'key' });
      }

      // Create pending sync store
      if (!database.objectStoreNames.contains(STORES.PENDING_SYNC)) {
        const syncStore = database.createObjectStore(STORES.PENDING_SYNC, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('type', 'type', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      console.log('IndexedDB schema created');
    };
  });
};

/**
 * Save lessons to offline storage
 */
export const saveLessonsOffline = async (lessons) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.LESSONS], 'readwrite');
    const store = transaction.objectStore(STORES.LESSONS);

    for (const lesson of lessons) {
      store.put(lesson);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Saved ${lessons.length} lessons offline`);
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error saving lessons offline:', error);
    throw error;
  }
};

/**
 * Get all lessons from offline storage
 */
export const getLessonsOffline = async (filters = {}) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.LESSONS], 'readonly');
    const store = transaction.objectStore(STORES.LESSONS);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        let lessons = request.result;

        // Apply filters
        if (filters.category) {
          lessons = lessons.filter(l => l.category === filters.category);
        }
        if (filters.language) {
          lessons = lessons.filter(l => l.language === filters.language);
        }

        resolve(lessons);
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting lessons offline:', error);
    return [];
  }
};

/**
 * Get single lesson from offline storage
 */
export const getLessonOffline = async (lessonId) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.LESSONS], 'readonly');
    const store = transaction.objectStore(STORES.LESSONS);

    return new Promise((resolve, reject) => {
      const request = store.get(lessonId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting lesson offline:', error);
    return null;
  }
};

/**
 * Save progress offline (to sync later)
 */
export const saveProgressOffline = async (progressData) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.PROGRESS, STORES.PENDING_SYNC], 'readwrite');
    
    // Save to progress store
    const progressStore = transaction.objectStore(STORES.PROGRESS);
    progressStore.add({
      ...progressData,
      timestamp: Date.now(),
      synced: false
    });

    // Add to pending sync queue
    const syncStore = transaction.objectStore(STORES.PENDING_SYNC);
    syncStore.add({
      type: 'progress',
      data: progressData,
      timestamp: Date.now()
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('Progress saved offline for later sync');
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error saving progress offline:', error);
    throw error;
  }
};

/**
 * Get pending sync items
 */
export const getPendingSyncItems = async () => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.PENDING_SYNC], 'readonly');
    const store = transaction.objectStore(STORES.PENDING_SYNC);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting pending sync items:', error);
    return [];
  }
};

/**
 * Clear synced items
 */
export const clearSyncedItems = async (itemIds) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.PENDING_SYNC], 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_SYNC);

    for (const id of itemIds) {
      store.delete(id);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Cleared ${itemIds.length} synced items`);
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error clearing synced items:', error);
  }
};

/**
 * Save user data offline
 */
export const saveUserDataOffline = async (key, data) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.USER_DATA], 'readwrite');
    const store = transaction.objectStore(STORES.USER_DATA);

    store.put({ key, data, timestamp: Date.now() });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error saving user data offline:', error);
  }
};

/**
 * Get user data offline
 */
export const getUserDataOffline = async (key) => {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORES.USER_DATA], 'readonly');
    const store = transaction.objectStore(STORES.USER_DATA);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting user data offline:', error);
    return null;
  }
};

/**
 * Clear all offline data
 */
export const clearOfflineData = async () => {
  try {
    const database = await initDB();
    const transaction = database.transaction(
      [STORES.LESSONS, STORES.PROGRESS, STORES.USER_DATA, STORES.PENDING_SYNC],
      'readwrite'
    );

    transaction.objectStore(STORES.LESSONS).clear();
    transaction.objectStore(STORES.PROGRESS).clear();
    transaction.objectStore(STORES.USER_DATA).clear();
    transaction.objectStore(STORES.PENDING_SYNC).clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('All offline data cleared');
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
};

export default {
  initDB,
  saveLessonsOffline,
  getLessonsOffline,
  getLessonOffline,
  saveProgressOffline,
  getPendingSyncItems,
  clearSyncedItems,
  saveUserDataOffline,
  getUserDataOffline,
  clearOfflineData
};
