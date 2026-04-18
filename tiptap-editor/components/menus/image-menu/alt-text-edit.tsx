import type React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MenuButton } from '../../menu-button';

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
    <form
      className='flex gap-4 bg-secondary p-2 rounded-lg'
      onSubmit={onSubmit}
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Text alternative '
        autoFocus
        className='flex-1'
      />
      <MenuButton
        buttonType='submit'
        icon={'Check'}
        tooltip={false}
        variant='outline'
      />
      <MenuButton
        icon={'Close'}
        tooltip={false}
        onClick={onCancel}
        variant='outline'
      />
    </form>
  );
};

export default AltTextEdit;
