import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const isExternalUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.origin !== window.location.origin;
  } catch {
    // relative URLs are internal
    return false;
  }
};

interface LinkEditProps {
  initialUrl?: string;
  initialText?: string;
  initialTarget?: string;
  isCreate?: boolean;
  onCancel?: () => void;
  onSubmit?: (url: string, text?: string, target?: string) => void;
}

const LinkEdit = ({
  initialUrl,
  initialText,
  initialTarget,
  isCreate,
  onSubmit,
  onCancel,
}: LinkEditProps) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [text, setText] = useState(initialText || '');
  const [openInNewTab, setOpenInNewTab] = useState(initialTarget === '_blank');
  const [canSubmit, setCanSubmit] = useState(isCreate);

  // Auto-detect external on URL change
  useEffect(() => {
    if (url && url !== initialUrl) {
      setOpenInNewTab(isExternalUrl(url));
    }
  }, [url, initialUrl]);

  useEffect(() => {
    setCanSubmit((url && url !== initialUrl) || text !== initialText);
  }, [text, url, initialUrl, initialText]);

  const handleClick = () => {
    if (url) {
      onSubmit?.(url, text, openInNewTab ? '_blank' : '_self');
    }
  };

  return (
    <div className='flex flex-col gap-3 p-1'>
      <div className='flex flex-col gap-1.5'>
        <Label>URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Paste link'
          type='url'
          required
          autoFocus
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>Display Text</Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Enter link text'
        />
      </div>

      <div className='flex items-center justify-between'>
        <Label className='cursor-pointer'>Open in new tab</Label>
        <Switch checked={openInNewTab} onCheckedChange={setOpenInNewTab} />
      </div>

      <div className='flex justify-end gap-2'>
        <Button variant='secondary' type='button' onClick={onCancel}>
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
