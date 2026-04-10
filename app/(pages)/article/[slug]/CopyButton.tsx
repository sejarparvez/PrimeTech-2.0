'use client';

import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className='invisible absolute right-2 top-2 z-20 bg-transparent p-2 group-hover:visible'
    >
      {copied ? <Check size={18} /> : <Clipboard size={18} />}
    </button>
  );
};

export default CopyButton;
