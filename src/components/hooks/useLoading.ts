import { create } from 'zustand';

type LoadingStore = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoadingStore;
