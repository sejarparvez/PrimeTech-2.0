'use client';

import MediaLibrary from '@/app/(pages)/dashboard/new-article/MediaLibrary';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorState } from '@tiptap/react';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useTiptapContext } from '../Provider';

interface ImageData {
  id?: string;
  url: string;
  width: number;
  height: number;
}

const ImageButton = () => {
  const { editor } = useTiptapContext();
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('image'),
      disabled: !ctx.editor.isEditable,
    }),
  });

  const handleInsert = (image: ImageData) => {
    editor
      .chain()
      .focus()
      .insertImage({
        src: image.url,
        width: image.width,
        height: image.height,
      })
      .run();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={state.active ? 'bg-muted' : ''}
                disabled={state.disabled}
              >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Insert image</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert image</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="mx-auto flex h-[95vh] w-[90vw] max-w-5xl flex-col px-4 py-0 md:h-[90vh] md:w-[70vw]">
        <DialogTitle hidden>Insert image</DialogTitle>
        <MediaLibrary onClose={() => setOpen(false)} onInsert={handleInsert} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageButton;
