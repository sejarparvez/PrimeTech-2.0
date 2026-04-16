import type React from 'react';

import { createPortal } from 'react-dom';

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
  const onDismiss = () => {
    onOpenChange?.(false);
  };

  if (!open) return null;

  return createPortal(
    // biome-ignore lint/a11y/useKeyWithClickEvents: this is fine
    <div
      role='dialog'
      className='rte-dialog'
      onClick={onDismiss}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: this is fine */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: this is fine */}
      <div
        className='rte-dialog__content'
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Dialog;
