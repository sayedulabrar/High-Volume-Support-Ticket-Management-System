import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
