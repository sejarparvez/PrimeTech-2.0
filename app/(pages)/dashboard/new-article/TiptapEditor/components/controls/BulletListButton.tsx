import { useEditorState } from '@tiptap/react';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTiptapContext } from '../Provider';

const BulletListButton = () => {
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('bulletList'),
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
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            type='button'
            size='icon'
          >
            <List size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bullet List (Ctrl+Shift+8)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BulletListButton;
