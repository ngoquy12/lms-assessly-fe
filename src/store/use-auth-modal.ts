import { create } from "zustand";

interface AuthModalStore {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
