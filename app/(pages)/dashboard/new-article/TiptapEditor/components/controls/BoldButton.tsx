import { Button } from '@/components/ui/button'; // Adjust the path as needed
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorState } from '@tiptap/react';
import { Bold } from 'lucide-react';
import { useTiptapContext } from '../Provider';

const BoldButton = () => {
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('bold'),
      disabled: !ctx.editor.can().toggleBold(),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type="button"
            size="icon"
          >
            <Bold size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold (Ctrl+B)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BoldButton;
