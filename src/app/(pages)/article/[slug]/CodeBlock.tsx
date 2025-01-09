"use client";

import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
const SyntaxHighlighter = Prism as any as React.FC<SyntaxHighlighterProps>;

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative", className)}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: "0",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default CodeBlock;
