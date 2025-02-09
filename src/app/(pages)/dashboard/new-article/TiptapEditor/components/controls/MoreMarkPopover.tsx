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
  LetterText,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from 'lucide-react';
import { useTiptapContext } from '../Provider';

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
                <LetterText />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>More format options</p>
          </TooltipContent>
          <PopoverContent className="w-auto p-2">
            <div className="flex space-x-1">
              <StrikeButton />
              <ItalicButton />
              <UnderlineButton />
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

const ItalicButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('italic'),
      disabled: !ctx.editor.can().toggleItalic(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type="button"
            size="icon"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic (Ctrl+I)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const UnderlineButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('underline'),
      disabled: !ctx.editor.can().toggleUnderline(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            type="button"
            size="icon"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Underline (Ctrl+U)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const StrikeButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('strike'),
      disabled: !ctx.editor.can().toggleStrike(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            type="button"
            size="icon"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Strikethrough (Ctrl+Shift+S)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SuperscriptButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('superscript'),
      disabled: !ctx.editor.can().toggleSuperscript(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            type="button"
            size="icon"
          >
            <Superscript className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Superscript (Ctrl+.)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SubscriptButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('subscript'),
      disabled: !ctx.editor.can().toggleSubscript(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            type="button"
            size="icon"
          >
            <Subscript className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Subscript (Ctrl+,)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CodeButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('code'),
      disabled: !ctx.editor.can().toggleCode(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
            type="button"
            size="icon"
          >
            <Code className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Inline code (Ctrl+E)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
