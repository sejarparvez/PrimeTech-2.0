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
import React, { CSSProperties, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ImTextColor } from 'react-icons/im';
import useMount from '../../hooks/useMount';
import ColorPicker from '../color-picker';
import { useTiptapContext } from '../Provider';

const TextColorButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mounted = useMount();
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      color: ctx.editor.getAttributes('textStyle').color || 'DEFAULT',
      disabled: !ctx.editor.can().setColor(''),
    }),
  });

  // Adjusted style: the button is relatively positioned and the color bar is flush at the bottom.
  const colorBarStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    height: 4,
    borderRadius: 4,
    pointerEvents: 'none',
    background:
      state.color === 'DEFAULT' ? 'var(--rte-fg, black)' : state.color,
  };

  const renderBar =
    mounted && buttonRef.current
      ? createPortal(<div style={colorBarStyle} />, buttonRef.current)
      : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Use a plain div as a non-interactive wrapper */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  ref={buttonRef}
                  variant="ghost"
                  size="icon"
                  type="button"
                  disabled={state.disabled}
                  aria-label="Text color"
                  style={{ position: 'relative' }}
                >
                  <ImTextColor size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <ColorPicker
                  color={state.color}
                  onChange={(color) =>
                    editor.chain().focus().setColor(color).run()
                  }
                  onReset={() => editor.chain().focus().unsetColor().run()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent>Color (Ctrl+Shift+C)</TooltipContent>
      </Tooltip>
      {renderBar}
    </TooltipProvider>
  );
};

export default TextColorButton;
