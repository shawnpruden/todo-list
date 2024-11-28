import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { db } from '../firebase';
import { TaskSchema } from '../schemas';
import useAuth from './useAuth';
import { toast } from 'sonner';

export type Task = {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const uid = user?.uid;

  const userTasksCollection = collection(db, `users/${uid}/tasks`);

  const getCurrentTimestamp = (): string => new Date().toISOString();

  const getAllTasks = async (): Promise<void> => {
    try {
      const snapshot = await getDocs(userTasksCollection);
      const fetchedTasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(fetchedTasks);
      setIsLoading(false);
    } catch (err) {
      toast.error('エラーが発生しました！');

      if (err instanceof Error) {
        console.log(err.message);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    if (uid) {
      getAllTasks();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addTask = async (values: z.infer<typeof TaskSchema>): Promise<void> => {
    setIsLoading(true);
    const validatedFields = TaskSchema.safeParse(values);

    if (validatedFields.success) {
      const { title, content } = validatedFields.data;

      try {
        const currentTimestamp = getCurrentTimestamp();
        const newTask: Omit<Task, 'id'> = {
          title,
          content,
          isCompleted: false,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        };
        await addDoc(userTasksCollection, newTask);

        await getAllTasks();
        toast.success('新しいタスクが追加されました！');
      } catch (err) {
        toast.error('エラーが発生しました！');

        if (err instanceof Error) {
          console.log(err.message);
        }

        setIsLoading(false);
      }
    } else {
      console.error(validatedFields.error);
    }
  };

  const editTask = async (
    values: z.infer<typeof TaskSchema>,
    id: string
  ): Promise<void> => {
    setIsLoading(true);

    const validatedFields = TaskSchema.safeParse(values);

    if (validatedFields.success) {
      const { title, content } = validatedFields.data;

      try {
        const currentTimestamp = getCurrentTimestamp();
        const taskRef = doc(db, `users/${uid}/tasks`, id);
        await updateDoc(taskRef, {
          title,
          content,
          updatedAt: currentTimestamp,
        });

        getAllTasks();
        toast.success('タスクが更新されました！');
      } catch (err) {
        toast.error('エラーが発生しました！');

        if (err instanceof Error) {
          console.log(err.message);
        }

        setIsLoading(false);
      }
    } else {
      console.error(validatedFields.error);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    setIsLoading(true);

    try {
      const taskRef = doc(db, `users/${uid}/tasks`, id);
      await deleteDoc(taskRef);

      getAllTasks();
      toast.success('タスクが削除されました！');
    } catch (err) {
      toast.error('エラーが発生しました！');

      if (err instanceof Error) {
        console.log(err.message);
      }

      setIsLoading(false);
    }
  };

  return { isLoading, tasks, addTask, editTask, deleteTask };
};

export default useTask;
