import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import MenuButton from '../../MenuButton';

interface AltTextEditProps {
  initialText?: string;
  onCancel: () => void;
  onApply: (value: string) => void;
}

const AltTextEdit = ({ initialText, onApply, onCancel }: AltTextEditProps) => {
  const [text, setText] = useState(initialText || '');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply(text);
  };

  return (
    <form className="flex min-w-80 flex-1 gap-2 px-2 py-1" onSubmit={onSubmit}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text alternative"
        className="w-full flex-1"
        autoFocus
      />
      <MenuButton buttonType="submit" icon={'Check'} tooltip={false} />
      <MenuButton icon={'Close'} tooltip={false} onClick={onCancel} />
    </form>
  );
};

export default AltTextEdit;
