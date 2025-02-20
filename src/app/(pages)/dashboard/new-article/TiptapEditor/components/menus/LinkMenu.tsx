import { useEditorState } from '@tiptap/react';
import React, { memo, useCallback, useRef, useState } from 'react';
import { BubbleMenu } from '../BubbleMenu';
import { useTiptapContext } from '../Provider';

export const LinkMenu = () => {
  const { editor, contentElement } = useTiptapContext();
  const [isEditing, setIsEditing] = useState(false);
  const mode = useRef<number>(0);

  const link = useEditorState({
    editor,
    selector: (context) => {
      mode.current = context.editor.storage.link.mode;

      if (!context.editor.isActive('link')) return null;
      const {
        state: { selection, doc },
      } = context.editor;
      const url = context.editor.getAttributes('link').href;
      const text = doc.textBetween(selection.from, selection.to);

      return { url, text };
    },
  });

  const shouldShow = useCallback(({ editor, from, to }: any) => {
    setIsEditing(mode.current == -1);
    return editor.isActive('link') && (mode.current == -1 || from !== to);
  }, []);

  const applyLink = useCallback((url: string, text?: string) => {
    editor
      .chain()
      .confirmEditLink({
        href: url,
        text: text || url,
      })
      .run();
    setIsEditing(false);
  }, []);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    if (mode.current == -1) {
      editor.commands.confirmEditLink();
    } else {
      setIsEditing(false);
    }
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="link-menu"
      updateDelay={100}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: 'bottom-start',
        duration: 100,
        appendTo: () => contentElement.current!,
        onHidden: () => setIsEditing(false),
      }}
    >
      {isEditing ? (
        <LinkEdit
          initialUrl={link?.url}
          initialText={link?.text}
          isCreate={mode.current === -1}
          onApply={applyLink}
          onCancel={cancelEdit}
        />
      ) : (
        <LinkView url={link?.url} onEdit={startEdit} onRemove={removeLink} />
      )}
    </BubbleMenu>
  );
};

export default memo(LinkMenu);

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  TbCheck,
  TbCopy,
  TbEdit,
  TbExternalLink,
  TbLinkOff,
} from 'react-icons/tb';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

interface LinkViewProps {
  url: string;
  onEdit?: () => void;
  onRemove?: () => void;
}

const LinkView = ({ url, onEdit, onRemove }: LinkViewProps) => {
  const { copy, isCopied } = useCopyToClipboard();

  const handleOpenNewTab = () => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={onEdit}
              >
                <TbEdit size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit link</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={handleOpenNewTab}
            >
              <TbExternalLink size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open in new tab</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() => copy(url)}
            >
              {isCopied ? <TbCheck size={20} /> : <TbCopy size={20} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCopied ? 'Copied' : 'Copy link'}</TooltipContent>
        </Tooltip>

        {onRemove && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={onRemove}
              >
                <TbLinkOff size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Unlink</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

interface LinkEditProps {
  initialUrl?: string;
  initialText?: string;
  isCreate?: boolean;
  onCancel: () => void;
  onApply: (url: string, text?: string) => void;
}

const LinkEdit = ({
  initialUrl,
  initialText,
  isCreate,
  onApply,
  onCancel,
}: LinkEditProps) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [text, setText] = useState(initialText || '');
  const [canSubmit, setCanSubmit] = useState(isCreate);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (canSubmit) {
      onApply(url!, text);
    }
  };

  useEffect(() => {
    if (!isCreate) {
      setCanSubmit((url && url !== initialUrl) || text !== initialText);
    }
  }, [text, url]);

  return (
    <form className="w-80 space-y-2 rounded border p-4" onSubmit={onSubmit}>
      <div>
        <Label>URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste link"
          type="url"
          required
          autoFocus
        />
      </div>
      <div>
        <Label>Display Text</Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter link text"
        />
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          Apply
        </Button>
      </div>
    </form>
  );
};
