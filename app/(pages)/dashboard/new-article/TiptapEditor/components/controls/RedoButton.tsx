import { useEditorState } from '@tiptap/react';
import { TbArrowForwardUp } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTiptapContext } from '../Provider';

const RedoButton = () => {
  const { editor } = useTiptapContext();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      disabled: !ctx.editor.can().redo(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            disabled={state.disabled}
            onClick={() => editor.chain().focus().redo().run()}
            type='button'
            size='icon'
          >
            <TbArrowForwardUp size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RedoButton;
