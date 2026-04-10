import { useEditorState } from '@tiptap/react';
import { ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTiptapContext } from '../Provider';

const OrderedListButton = () => {
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('orderedList'),
        disabled: !ctx.editor.isEditable,
      };
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type='button'
            size='icon'
          >
            <ListOrdered size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ordered List (Ctrl+Shift+7)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OrderedListButton;
