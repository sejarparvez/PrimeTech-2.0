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
import {
  Code,
  Italic,
  MoreHorizontal,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from 'lucide-react';
import React from 'react';
import { useTiptapContext } from '../Provider';

type ToggleCommand =
  | 'strike'
  | 'italic'
  | 'underline'
  | 'superscript'
  | 'subscript'
  | 'code';

// Map each command to its corresponding chain method name
const commandMap: Record<ToggleCommand, string> = {
  strike: 'toggleStrike',
  italic: 'toggleItalic',
  underline: 'toggleUnderline',
  superscript: 'toggleSuperscript',
  subscript: 'toggleSubscript',
  code: 'toggleCode',
};

const MoreMarkPopover = () => {
  const { editor } = useTiptapContext();

  const isDisabled = useEditorState({
    editor,
    selector: (ctx) =>
      !ctx.editor.can().setStrike() &&
      !ctx.editor.can().toggleItalic() &&
      !ctx.editor.can().toggleUnderline() &&
      !ctx.editor.can().setSuperscript() &&
      !ctx.editor.can().setSubscript() &&
      !ctx.editor.can().setCode(),
  });

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDisabled}
                className="rounded-lg"
                aria-label="More formatting options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>More formatting options</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-auto rounded-xl p-2 shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton
              icon={Strikethrough}
              command="strike"
              shortcut="Ctrl+Shift+S"
              action={(editor) => editor.chain().focus().toggleStrike()}
            />
            <ToggleButton
              icon={Italic}
              command="italic"
              shortcut="Ctrl+I"
              action={(editor) => editor.chain().focus().toggleItalic()}
            />
            <ToggleButton
              icon={Underline}
              command="underline"
              shortcut="Ctrl+U"
              action={(editor) => editor.chain().focus().toggleUnderline()}
            />
            <ToggleButton
              icon={Superscript}
              command="superscript"
              shortcut="Ctrl+."
              action={(editor) => editor.chain().focus().toggleSuperscript()}
            />
            <ToggleButton
              icon={Subscript}
              command="subscript"
              shortcut="Ctrl+,"
              action={(editor) => editor.chain().focus().toggleSubscript()}
            />
            <ToggleButton
              icon={Code}
              command="code"
              shortcut="Ctrl+E"
              action={(editor) => editor.chain().focus().toggleCode()}
            />
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

const ToggleButton = ({
  icon: Icon,
  command,
  shortcut,
  action,
}: {
  icon: React.ElementType;
  command: ToggleCommand;
  shortcut: string;
  action: (editor: any) => any;
}) => {
  const { editor } = useTiptapContext();

  // Get the method name from the command mapping.
  const methodName = commandMap[command];

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive(command),
      // Cast the chain object to any so that dynamic indexing is allowed.
      disabled: !(ctx.editor.can().chain().focus() as any)[methodName]?.(),
    }),
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={state.active ? 'default' : 'ghost'}
          size="icon"
          disabled={state.disabled}
          onClick={() => action(editor).run()}
          aria-label={command}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-2">
        <span className="capitalize">{command}</span>
        <span className="text-xs text-muted-foreground">{shortcut}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default MoreMarkPopover;
