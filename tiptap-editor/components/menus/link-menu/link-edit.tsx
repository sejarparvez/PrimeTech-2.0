import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkEditProps {
  initialUrl?: string;
  initialText?: string;
  isCreate?: boolean;
  onCancel?: () => void;
  onSubmit?: (url: string, text?: string) => void;
}

const LinkEdit = ({
  initialUrl,
  initialText,
  isCreate,
  onSubmit,
  onCancel,
}: LinkEditProps) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [text, setText] = useState(initialText || '');
  const [canSubmit, setCanSubmit] = useState(isCreate);

  // Updated to handle click instead of form event
  const handleClick = () => {
    if (url) {
      onSubmit?.(url, text);
    }
  };

  useEffect(() => {
    setCanSubmit((url && url !== initialUrl) || text !== initialText);
  }, [text, url, initialUrl, initialText]);

  return (
    <div className='rte-link__form'>
      <Label>URL</Label>
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className='rte-link__input'
        placeholder='Paste link'
        type='url'
        required
        autoFocus
      />

      <Label className='rte-link__label'>Display Text</Label>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='rte-link__input'
        placeholder='Enter link text'
      />

      <div className='rte-link__actions'>
        <Button variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='button' disabled={!canSubmit} onClick={handleClick}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default LinkEdit;
