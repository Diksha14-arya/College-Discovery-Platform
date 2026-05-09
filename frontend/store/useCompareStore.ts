import { create } from 'zustand';

interface CompareStore {
  selectedColleges: string[];
  addCollege: (id: string) => void;
  removeCollege: (id: string) => void;
  clearColleges: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  selectedColleges: [],
  addCollege: (id) => set((state) => ({
    selectedColleges: state.selectedColleges.length < 3 && !state.selectedColleges.includes(id) 
      ? [...state.selectedColleges, id] 
      : state.selectedColleges
  })),
  removeCollege: (id) => set((state) => ({
    selectedColleges: state.selectedColleges.filter(cId => cId !== id)
  })),
  clearColleges: () => set({ selectedColleges: [] })
}));
