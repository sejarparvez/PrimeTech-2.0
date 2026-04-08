import { useEditorState } from '@tiptap/react';
import { TbLink } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTiptapContext } from '../Provider';

const LinkButton = () => {
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('link'),
      disabled: !ctx.editor.can().setLink({ href: '' }),
    }),
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.active ? 'default' : 'ghost'}
            disabled={state.disabled}
            onClick={() => editor.commands.startEditLink()}
            type='button'
            size='icon'
          >
            <TbLink size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Link (Ctrl+K)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LinkButton;
