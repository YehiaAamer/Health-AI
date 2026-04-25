import { createContext, useContext, useMemo, useState, useEffect } from "react";

interface Prediction {
  id: number;
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
  probability: number;
  risk_level: string;
  message: string;
  created_at: string;
}

interface TrashContextType {
  trashedItems: Prediction[];
  deletedIds: number[];
  addToTrash: (item: Prediction) => void;
  restoreFromTrash: (id: number) => void;
  deletePermanently: (id: number) => void;
}

const TrashContext = createContext<TrashContextType | null>(null);

const TRASH_KEY = "healthai_trash";
const DELETED_IDS_KEY = "healthai_deleted_ids";

export const TrashProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [trashedItems, setTrashedItems] = useState<Prediction[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTrash = localStorage.getItem(TRASH_KEY);
      const storedDeletedIds = localStorage.getItem(DELETED_IDS_KEY);

      if (storedTrash) {
        setTrashedItems(JSON.parse(storedTrash));
      }

      if (storedDeletedIds) {
        setDeletedIds(JSON.parse(storedDeletedIds));
      }
    } catch (err) {
      console.error("Error loading trash data:", err);
    }
  }, []);

  // ✅ Save trashed items
  useEffect(() => {
    localStorage.setItem(TRASH_KEY, JSON.stringify(trashedItems));
  }, [trashedItems]);

  // ✅ Save deleted IDs
  useEffect(() => {
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds));
  }, [deletedIds]);

  const addToTrash = (item: Prediction) => {
    setTrashedItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) return prev;
      return [item, ...prev];
    });

    setDeletedIds((prev) => {
      if (prev.includes(item.id)) return prev;
      return [item.id, ...prev];
    });
  };

  const restoreFromTrash = (id: number) => {
    setTrashedItems((prev) => prev.filter((item) => item.id !== id));
    setDeletedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const deletePermanently = (id: number) => {
    setTrashedItems((prev) => prev.filter((item) => item.id !== id));
    setDeletedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const value = useMemo(
    () => ({
      trashedItems,
      deletedIds,
      addToTrash,
      restoreFromTrash,
      deletePermanently,
    }),
    [trashedItems, deletedIds]
  );

  return (
    <TrashContext.Provider value={value}>{children}</TrashContext.Provider>
  );
};

export const useTrash = () => {
  const context = useContext(TrashContext);

  if (!context) {
    throw new Error("useTrash must be used within TrashProvider");
  }

  return context;
};