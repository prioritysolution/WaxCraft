"use client";

import { useContext, createContext, useState, useCallback, ReactNode } from "react";

// Define the shape of the context value
interface ModalContextType {
  modalOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

// Create context with a default value of `undefined` for safety
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Custom hook to use ModalContext
export const useModalOpen = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalOpen must be used within a ModalProvider");
  }
  return context;
};

// Define the provider props
interface ModalProviderProps {
  children: ReactNode;
}

// ModalProvider component
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = useCallback(() => setModalOpen(true), []);
  const handleClose = useCallback(() => setModalOpen(false), []);

  return (
    <ModalContext.Provider value={{ modalOpen, handleOpen, handleClose }}>
      {children}
    </ModalContext.Provider>
  );
};
