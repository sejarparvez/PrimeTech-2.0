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
import React, { CSSProperties, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BiSolidColorFill } from 'react-icons/bi';
import useMount from '../../hooks/useMount';
import { useTiptapContext } from '../Provider';
import ColorPicker from '../color-picker';

const TextHighlightButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mounted = useMount();
  const { editor } = useTiptapContext();
  const [highlightColor, setHighlightColor] = useState<string | 'DEFAULT'>(
    'DEFAULT'
  );
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      color: ctx.editor.getAttributes('highlight').color || 'DEFAULT',
      disabled: !ctx.editor.can().setHighlight(),
    }),
  });

  const highlightBarStyle = {
    position: 'absolute',
    bottom: 1.5,
    insetInline: 4,
    height: 4,
    borderRadius: 4,
    pointerEvents: 'none',
    background:
      state.color === 'DEFAULT' ? 'var(--rte-bg, white)' : state.color,
  };

  const renderBar =
    mounted && buttonRef.current
      ? createPortal(
          <div style={highlightBarStyle as CSSProperties} />,
          buttonRef.current
        )
      : null;

  return (
    <>
      {renderBar}
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
                    <BiSolidColorFill size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <ColorPicker
                    //  color={highlightColor}
                    color={state.color}
                    onChange={(color) =>
                      editor.chain().focus().setHighlight({ color }).run()
                    }
                    onReset={() =>
                      editor.chain().focus().unsetHighlight().run()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </TooltipTrigger>
          <TooltipContent>Color (Ctrl+Shift+C)</TooltipContent>
        </Tooltip>
        {renderBar}
      </TooltipProvider>
    </>
  );
};

export default TextHighlightButton;
