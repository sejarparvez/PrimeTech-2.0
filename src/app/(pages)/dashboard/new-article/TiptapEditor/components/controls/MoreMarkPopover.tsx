'use client';

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
import { useEditorState } from '@tiptap/react';
import { CaseSensitiveIcon as LetterCase } from 'lucide-react';
import { useTiptapContext } from '../Provider';
import CodeButton from './CodeButton';
import StrikeButton from './StrikeButton';
import SubscriptButton from './SubscriptButton';
import SuperscriptButton from './SuperscriptButton';

const MoreMarkPopover = () => {
  const { editor } = useTiptapContext();

  const isDisabled = useEditorState({
    editor,
    selector: (ctx) =>
      !ctx.editor.can().setStrike() &&
      !ctx.editor.can().setSuperscript() &&
      !ctx.editor.can().setSubscript() &&
      !ctx.editor.can().setCode(),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDisabled}
                aria-label="More format options"
              >
                <LetterCase />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>More format options</p>
          </TooltipContent>
          <PopoverContent className="w-auto p-2">
            <div className="flex space-x-1">
              <StrikeButton />
              <SuperscriptButton />
              <SubscriptButton />
              <CodeButton />
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MoreMarkPopover;
