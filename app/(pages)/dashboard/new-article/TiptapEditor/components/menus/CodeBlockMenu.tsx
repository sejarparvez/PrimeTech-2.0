import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorState } from '@tiptap/react';
import { memo, useCallback } from 'react';
import { TbCheck, TbCopy, TbTrash } from 'react-icons/tb';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import { getNodeContainer } from '../../utils/getNodeContainer';
import { BubbleMenu } from '../BubbleMenu';
import { useTiptapContext } from '../Provider';

export const CodeBlockMenu = () => {
  const { editor, contentElement } = useTiptapContext();
  const { isCopied, copy } = useCopyToClipboard();

  // Retrieve the language attribute from the active code block.
  const language = useEditorState({
    editor,
    selector: (state) => {
      if (state.editor.isActive('codeBlock')) {
        return state.editor.getAttributes('codeBlock').language;
      }
      return null;
    },
  });

  // Show the bubble menu only when the code block is active.
  const shouldShow = useCallback(
    ({ editor: editorInstance }: { editor: any }) =>
      editorInstance.isActive('codeBlock'),
    []
  );

  // Update the language attribute when a new language is selected.
  const handleSelect = useCallback(
    (value: string) => {
      editor.commands.updateAttributes('codeBlock', { language: value });
    },
    [editor]
  );

  // Copy the code content from the <pre> container.
  const handleCopy = useCallback(() => {
    const node = getNodeContainer(editor, 'pre');
    if (node?.textContent) {
      copy(node.textContent);
    }
  }, [editor, copy]);

  // Delete the code block node.
  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteNode('codeBlock').run();
  }, [editor]);

  // Provide the bounding rectangle of the <pre> container for tooltip positioning.
  const getReferenceClientRect = useCallback(() => {
    const node = getNodeContainer(editor, 'pre');
    return node?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="code-block-bubble"
      shouldShow={shouldShow}
      updateDelay={100}
      tippyOptions={{
        placement: 'top',
        maxWidth: 'auto',
        appendTo: () => contentElement.current!,
        getReferenceClientRect,
      }}
    >
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
          <CodeDropdown value={language} onSelect={handleSelect} />
          <Separator orientation="vertical" className="mx-1 h-5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy code"
              >
                {isCopied ? <TbCheck size={20} /> : <TbCopy size={20} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={handleDelete}
                aria-label="Delete code"
              >
                <TbTrash size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete code</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </BubbleMenu>
  );
};

export default memo(CodeBlockMenu);

import { CODE_BLOCK_LANGUAGUES } from '@/app/(pages)/dashboard/new-article/TiptapEditor/constants/code-languages';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMemo, useState } from 'react';
import { TbChevronDown } from 'react-icons/tb';

interface CodeDropdownProps {
  value: string;
  onSelect: (value: string) => void;
}

const CodeDropdown = ({ value, onSelect }: CodeDropdownProps) => {
  const { contentElement } = useTiptapContext();
  const [search, setSearch] = useState('');

  const options = CODE_BLOCK_LANGUAGUES.map((item) => ({
    label: item.label,
    value: item.syntax,
  }));

  const filterOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find((item) => item.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex min-w-[6rem] items-center justify-between"
        >
          <span>
            {selectedOption ? selectedOption.label : 'Select language'}
          </span>
          <TbChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <Input
          className="mb-2 h-9 w-full"
          placeholder="Search language..."
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
        />
        <div
          className="flex flex-col gap-1 overflow-auto"
          style={{
            maxHeight: `${
              ((contentElement.current as HTMLElement)?.clientHeight || 0) *
              0.375
            }px`,
          }}
        >
          {filterOptions.map((item) => (
            <div
              key={item.value}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm leading-5 hover:bg-accent"
              onClick={() => {
                onSelect(item.value);
                setSearch('');
              }}
            >
              {item.value === value ? (
                <TbCheck size={14} className="text-primary" />
              ) : (
                <span className="w-4" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
