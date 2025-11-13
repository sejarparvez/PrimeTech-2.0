import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorState } from '@tiptap/react';
import { Code, Maximize2, Minimize2 } from 'lucide-react';
import React from 'react';
import { useTiptapContext } from './Provider';

const StatusBar: React.FC = () => {
  const {
    editor,
    isFullScreen,
    isSourceMode,
    toggleFullScreen,
    toggleSourceMode,
  } = useTiptapContext();

  const counter = useEditorState({
    editor,
    selector: (ctx) => ({
      words: ctx.editor.storage.characterCount.words(),
      characters: ctx.editor.storage.characterCount.characters(),
    }),
  });

  return (
    <div className="flex min-h-11 items-center rounded-b-md border-t bg-background">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isSourceMode ? 'secondary' : 'ghost'}
                size="icon"
                type="button"
                onClick={toggleSourceMode}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Source Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isFullScreen ? 'secondary' : 'ghost'}
                size="icon"
                type="button"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fullscreen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="ml-auto space-x-2 px-2 py-1">
        <span>Words: {counter.words}</span>
        <span>Characters: {counter.characters}</span>
      </div>
    </div>
  );
};

export default React.memo(StatusBar);
