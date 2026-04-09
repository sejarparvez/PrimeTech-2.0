import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorState } from '@tiptap/react';
import { CornerUpLeft } from 'lucide-react';
import { useTiptapContext } from '../Provider';

const UndoButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      disabled: !ctx.editor.can().undo(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            disabled={state.disabled}
            onClick={() => editor.chain().focus().undo().run()}
            type='button'
            size='icon'
          >
            <CornerUpLeft size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UndoButton;
