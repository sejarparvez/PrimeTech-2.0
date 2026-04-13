'use client';

import { useState } from 'react';
import { LuCheck, LuClipboard } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {}
  };

  return (
    <Button
      variant='outline'
      onClick={copyToClipboard}
      className='absolute top-2 right-2  p-2 z-20 invisible group-hover:visible'
    >
      {copied ? <LuCheck size={18} /> : <LuClipboard size={18} />}
    </Button>
  );
};

export default CopyButton;
