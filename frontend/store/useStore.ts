import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface College {
  id: string
  name: string
  location: string
  rating: number
  fees: number
  placementPercentage: number
  averagePackage: number
  highestPackage: number
  imageUrl: string
  slug: string
}

interface AppState {
  compareList: College[]
  savedColleges: College[]
  addToCompare: (college: College) => void
  removeFromCompare: (collegeId: string) => void
  clearCompare: () => void
  addToSaved: (college: College) => void
  removeFromSaved: (collegeId: string) => void
  setSavedColleges: (colleges: College[]) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      compareList: [],
      savedColleges: [],
      addToCompare: (college) =>
        set((state) => {
          if (state.compareList.find((c) => c.id === college.id)) return state
          if (state.compareList.length >= 3) return state // Max 3 colleges for comparison
          return { compareList: [...state.compareList, college] }
        }),
      removeFromCompare: (collegeId) =>
        set((state) => ({
          compareList: state.compareList.filter((c) => c.id !== collegeId),
        })),
      clearCompare: () => set({ compareList: [] }),
      addToSaved: (college) =>
        set((state) => {
          if (state.savedColleges.find((c) => c.id === college.id)) return state
          return { savedColleges: [...state.savedColleges, college] }
        }),
      removeFromSaved: (collegeId) =>
        set((state) => ({
          savedColleges: state.savedColleges.filter((c) => c.id !== collegeId),
        })),
      setSavedColleges: (colleges) => set({ savedColleges: colleges }),
    }),
    {
      name: 'college-compass-storage',
    }
  )
)
