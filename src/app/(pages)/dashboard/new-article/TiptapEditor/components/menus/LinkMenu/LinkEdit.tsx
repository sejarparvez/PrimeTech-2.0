import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';

interface LinkEditProps {
  initialUrl?: string;
  initialText?: string;
  isCreate?: boolean;
  onCancel: () => void;
  onApply: (url: string, text?: string) => void;
}

const LinkEdit = ({
  initialUrl,
  initialText,
  isCreate,
  onApply,
  onCancel,
}: LinkEditProps) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [text, setText] = useState(initialText || '');
  const [canSubmit, setCanSubmit] = useState(isCreate);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (canSubmit) {
      onApply(url!, text);
    }
  };

  useEffect(() => {
    if (!isCreate) {
      setCanSubmit((url && url !== initialUrl) || text !== initialText);
    }
  }, [text, url]);

  return (
    <form className="w-80 space-y-2 rounded border p-4" onSubmit={onSubmit}>
      <div>
        <Label>URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste link"
          type="url"
          required
          autoFocus
        />
      </div>
      <div>
        <Label>Display Text</Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter link text"
        />
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          Apply
        </Button>
      </div>
    </form>
  );
};

export default LinkEdit;
