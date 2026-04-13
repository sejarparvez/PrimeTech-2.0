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

  if (!open) return;

  return createPortal(
    // biome-ignore lint/a11y/useKeyWithClickEvents: this is fine
    <div role='dialog' className='rte-dialog' onClick={onDismiss}>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: this is fine */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: this is fine */}
      <div className='rte-dialog__content' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    // biome-ignore lint/style/noNonNullAssertion: this is fine
    document.querySelector('body')!,
  );
};

export default Dialog;
