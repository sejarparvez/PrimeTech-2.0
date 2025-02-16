'use client';

import { getNodeContainer } from '@/app/(pages)/dashboard/new-article/TiptapEditor/utils/getNodeContainer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Node } from '@tiptap/pm/model';
import { NodeSelection, type Selection, TextSelection } from '@tiptap/pm/state';
import { useEditorState } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';
import { TbDownload, TbTextCaption, TbTrash } from 'react-icons/tb';
import type { Instance } from 'tippy.js';
import { BubbleMenu } from '../../BubbleMenu';
import { useTiptapContext } from '../../Provider';
import AltTextEdit from './AltTextEdit';
import SizeDropdown from './SizeDropdown';

export const ImageMenu = () => {
  const tippyInstance = useRef<Instance | null>(null);
  const { editor, isResizing, contentElement } = useTiptapContext();
  const [isEditText, setIsEditText] = useState(false);

  const image = useEditorState({
    editor,
    selector: (ctx) => {
      if (
        !ctx.editor.isActive('image') &&
        !ctx.editor.isActive('imageFigure')
      ) {
        return null;
      }

      const { node, pos } = getImageOrFigureNode(ctx.editor.state.selection);
      if (!node) return null;

      return {
        pos,
        src: node.attrs.src,
        alt: node.attrs.alt,
        width: node.attrs.width,
        hasCaption: ctx.editor.isActive('imageFigure'),
      };
    },
  });

  const getReferenceClientRect = useCallback(() => {
    const selector = editor.isActive('imageFigure') ? 'figure' : 'img';
    const node = getNodeContainer(editor, selector);
    return node?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);
  }, [editor]);

  const updateImageAttr = (name: string, value: any) => {
    const {
      state: { selection },
    } = editor;
    return editor
      .chain()
      .command(({ commands }) => {
        if (image?.pos && selection.from !== image.pos)
          return commands.setNodeSelection(image.pos);
        return true;
      })
      .updateAttributes('image', { [name]: value })
      .focus()
      .run();
  };

  const toggleCaption = () =>
    editor
      .chain()
      .focus()
      [image?.hasCaption ? 'figureToImage' : 'imageToFigure']()
      .run();

  const toggleEditAltText = () => {
    setIsEditText((prev) => !prev);
    requestAnimationFrame(() =>
      tippyInstance.current?.popperInstance?.update()
    );
  };

  const setAltText = (value: string) => {
    updateImageAttr('alt', value);
    toggleEditAltText();
  };

  const setSize = (value: number | null) => updateImageAttr('width', value);

  const removeImage = () => editor.chain().focus().removeImage().run();

  const downloadImage = useCallback(async () => {
    if (!image?.src)
      return console.error('No image source available for download.');

    try {
      const res = await fetch(image.src);
      if (!res.ok) throw new Error('Failed to fetch the image.');
      const blob = await res.blob();
      const extension = blob.type.split(/\/|\+/)[1];

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }, [image]);

  if (isResizing) return null;

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="image-bubble"
      shouldShow={({ editor }) =>
        editor.isActive('imageFigure') || editor.isActive('image')
      }
      updateDelay={100}
      tippyOptions={{
        maxWidth: 'auto',
        offset: [0, 15],
        appendTo: () => contentElement.current!,
        getReferenceClientRect,
        onShow: (instance) => {
          tippyInstance.current = instance;
        },
        onDestroy: () => (tippyInstance.current = null),
        onHidden: () => setIsEditText(false),
      }}
    >
      {isEditText ? (
        <AltTextEdit
          initialText={image?.alt}
          onApply={setAltText}
          onCancel={() => {
            editor.commands.focus();
            toggleEditAltText();
          }}
        />
      ) : (
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleEditAltText}
                  type="button"
                  size="sm"
                  variant="ghost"
                >
                  Alt Text
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit alt text</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleCaption}
                  type="button"
                  size="icon"
                  variant={image?.hasCaption ? 'secondary' : 'ghost'}
                >
                  <TbTextCaption size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle caption</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <SizeDropdown value={image?.width} onChange={setSize} />
              </TooltipTrigger>
              <TooltipContent>Resize image</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={downloadImage}
                >
                  <TbDownload size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={removeImage}
                >
                  <TbTrash size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove image</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}
    </BubbleMenu>
  );
};

export default ImageMenu;

const getImageOrFigureNode = (
  selection: Selection
): { node: Node | null; pos: number | null } => {
  let node: Node | null = null;
  let pos: number | null = null;

  if (selection instanceof TextSelection) {
    const $anchor = selection.$anchor;
    const figure = $anchor.node(-1);
    node = figure.firstChild;
    pos = $anchor.before(-1) + 1;
  } else if (selection instanceof NodeSelection) {
    node = selection.node;
    pos = selection.from;
    if (node.type.name === 'imageFigure') {
      node = node.firstChild;
      pos += 1;
    }
  }

  return { node, pos };
};
