'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Code2, Plus, Quote, Youtube } from 'lucide-react';
import { useTiptapContext } from '../Provider';

const InsertDropdown = () => {
  const { editor } = useTiptapContext();

  const insertCodeBlock = () => editor.chain().focus().setCodeBlock().run();

  const insertBlockquote = () => editor.chain().focus().setBlockquote().run();

  const insertYoutube = () => {
    const src = prompt(
      'Embed Youtube Video',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
    if (src) {
      editor.chain().focus().embedYoutube({ src }).run();
    }
  };

  const menuItems = [
    { text: 'Blockquote', icon: Quote, onClick: insertBlockquote },
    { text: 'Code block', icon: Code2, onClick: insertCodeBlock },
    { text: 'Youtube', icon: Youtube, onClick: insertYoutube },
  ];

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!editor.isEditable}
                aria-label="Insert"
              >
                <Plus />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert</p>
          </TooltipContent>
          <DropdownMenuContent className="w-40">
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.text} onSelect={item.onClick}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.text}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InsertDropdown;
