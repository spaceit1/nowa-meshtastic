import { useState } from "react";

export interface UseModalReturn {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export const useModal = (): UseModalReturn => {
   const [isOpen, setIsOpen] = useState(false);

   const open = () => setIsOpen(true);
   const close = () => setIsOpen(false);
   const toggle = () => setIsOpen(!isOpen);

   return {
      isOpen,
      open,
      close,
      toggle,
   };
};
