import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

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
    <div className='flex min-w-80 flex-1 gap-2 px-2 py-1'>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Text alternative'
        className='w-full flex-1'
        autoFocus
      />

      <Button variant='ghost' size='icon' type='button' onClick={onSubmit}>
        <Check size={20} />
      </Button>
      <Button variant='ghost' size='icon' type='button' onClick={onCancel}>
        <X size={20} />
      </Button>
    </div>
  );
};

export default AltTextEdit;
