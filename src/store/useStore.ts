import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export type TaskPriority = 'low' | 'medium' | 'high';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  energyLevel: EnergyLevel;
  estimatedTime: number; // in minutes
  status: TaskStatus;
  createdAt: number;
}

export type CalendarEventType = 'task' | 'meeting' | 'reminder';

export interface CalendarEvent {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  title: string;
  type: CalendarEventType;
}

interface AppState {
  // Focus Mode State
  isFocusMode: boolean;
  setFocusMode: (isFocus: boolean) => void;

  // Timer State
  timerDuration: number;
  timerRemaining: number;
  timerStatus: 'idle' | 'running' | 'paused' | 'break';
  setTimerStatus: (status: 'idle' | 'running' | 'paused' | 'break') => void;
  setTimerRemaining: (time: number) => void;
  setTimerDuration: (time: number) => void;
  focusTimeToday: number; // in minutes
  addFocusTime: (minutes: number) => void;

  // Task State
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // User State
  mood: string | null;
  setMood: (mood: string) => void;
  xp: number;
  addXp: (amount: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  profile: { occupation: string; bio: string };
  setProfile: (profile: { occupation: string; bio: string }) => void;
  updateProfileData: (profile: { occupation: string; bio: string }) => Promise<void>;

  // Calendar State
  calendarEvents: CalendarEvent[];
  setCalendarEvents: (events: CalendarEvent[]) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  isFocusMode: false,
  setFocusMode: (isFocus) => set({ isFocusMode: isFocus }),

  timerDuration: 25 * 60, // 25 minutes default
  timerRemaining: 25 * 60,
  timerStatus: 'idle',
  setTimerStatus: (status) => set({ timerStatus: status }),
  setTimerRemaining: (time) => set({ timerRemaining: time }),
  setTimerDuration: (time) => set({ timerDuration: time, timerRemaining: time }),
  
  focusTimeToday: 0,
  addFocusTime: (minutes) => set((state) => ({ focusTimeToday: state.focusTimeToday + minutes })),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: async (task) => {
    const id = Math.random().toString(36).substring(7);
    const newTask: Task = { ...task, id, createdAt: Date.now(), status: 'todo' };
    
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    
    if (auth.currentUser) {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/tasks`, id), newTask);
    }
  },
  updateTaskStatus: async (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
    
    if (auth.currentUser) {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/tasks`, id), { status });
    }
  },
  deleteTask: async (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    
    if (auth.currentUser) {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/tasks`, id));
    }
  },

  mood: null,
  setMood: (mood) => set({ mood }),
  
  xp: 0,
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  profile: { occupation: 'Productivity Explorer', bio: '' },
  setProfile: (profile) => set({ profile }),
  updateProfileData: async (profile) => {
    set({ profile });
    if (auth.currentUser) {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/profile`, 'data'), profile);
    }
  },

  calendarEvents: [],
  setCalendarEvents: (events) => set({ calendarEvents: events }),
  addCalendarEvent: async (event) => {
    const id = Math.random().toString(36).substring(7);
    const newEvent: CalendarEvent = { ...event, id };
    
    set((state) => ({ calendarEvents: [...state.calendarEvents, newEvent] }));
    
    if (auth.currentUser) {
      await setDoc(doc(db, `users/${auth.currentUser.uid}/calendarEvents`, id), newEvent);
    }
  },
  deleteCalendarEvent: async (id) => {
    set((state) => ({ calendarEvents: state.calendarEvents.filter(e => e.id !== id) }));
    
    if (auth.currentUser) {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/calendarEvents`, id));
    }
  },
}));
