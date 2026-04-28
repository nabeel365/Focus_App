"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { useStore, Task, CalendarEvent } from "@/store/useStore";

export function FirestoreSync() {
  const { user } = useAuth();
  const setTasks = useStore((state) => state.setTasks);
  const setCalendarEvents = useStore((state) => state.setCalendarEvents);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setCalendarEvents([]);
      return;
    }

    // Sync Tasks
    const qTasks = query(collection(db, `users/${user.uid}/tasks`));
    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => tasksData.push(doc.data() as Task));
      setTasks(tasksData.sort((a, b) => b.createdAt - a.createdAt));
    });

    // Sync Calendar Events
    const qEvents = query(collection(db, `users/${user.uid}/calendarEvents`));
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
      const eventsData: CalendarEvent[] = [];
      snapshot.forEach((doc) => eventsData.push(doc.data() as CalendarEvent));
      setCalendarEvents(eventsData);
    });

    // Sync Profile
    const unsubscribeProfile = onSnapshot(doc(db, `users/${user.uid}/profile`, 'data'), (docSnap) => {
      if (docSnap.exists()) {
        useStore.getState().setProfile(docSnap.data() as { occupation: string; bio: string });
      } else {
        useStore.getState().setProfile({ occupation: 'Productivity Explorer', bio: '' });
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeEvents();
      unsubscribeProfile();
    };
  }, [user, setTasks, setCalendarEvents]);

  return null;
}
