'use client';

import { useEditorState } from '@tiptap/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTiptapContext } from '../Provider';

const AlignPopover = () => {
  const { editor } = useTiptapContext();

  const current = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor.isActive({ textAlign: 'right' })) return 'right';
      if (ctx.editor.isActive({ textAlign: 'center' })) return 'center';
      if (ctx.editor.isActive({ textAlign: 'justify' })) return 'justify';
      return 'left';
    },
  });

  const isDisabled = !editor.isEditable || !editor.can().setTextAlign('left');

  const alignmentOptions = [
    { name: 'left', icon: AlignLeft },
    { name: 'center', icon: AlignCenter },
    { name: 'right', icon: AlignRight },
    { name: 'justify', icon: AlignJustify },
  ];

  const CurrentIcon =
    alignmentOptions.find((option) => option.name === current)?.icon ||
    AlignLeft;

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                disabled={isDisabled}
                aria-label='Text alignment'
              >
                <CurrentIcon />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Text alignment</p>
          </TooltipContent>
          <PopoverContent className='w-auto p-2'>
            <div className='flex space-x-1'>
              {alignmentOptions.map((option) => (
                <Button
                  key={option.name}
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    editor.chain().focus().setTextAlign(option.name).run()
                  }
                  className={current === option.name ? 'bg-muted' : ''}
                >
                  <option.icon className='h-4 w-4' />
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AlignPopover;
