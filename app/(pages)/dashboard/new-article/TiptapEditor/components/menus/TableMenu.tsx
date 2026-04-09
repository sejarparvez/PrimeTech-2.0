'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Editor } from '@tiptap/core';
import {
  BetweenHorizontalEnd,
  BetweenHorizontalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  Columns2,
  Rows2,
  TableCellsMerge,
  TableCellsSplit,
  Trash2,
  X,
  XSquare,
} from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';
import { getNodeContainer } from '../../utils/getNodeContainer';
import { BubbleMenu, type BubbleMenuProps } from '../BubbleMenu';
import { useTiptapContext } from '../Provider';

interface MenuButtonProps {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' type='button' size='icon' onClick={onClick}>
          <Icon className='h-4 w-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TableMenu: React.FC = () => {
  const { editor, contentElement } = useTiptapContext();

  const shouldShow = useCallback(({ editor }: { editor: Editor }): boolean => {
    return editor.isActive('table');
  }, []);

  const getReferenceClientRect = useCallback((): DOMRect => {
    const node = getNodeContainer(editor, 'table');
    return node?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);
  }, [editor]);

  const addRowOrColumn = useCallback(
    (type: 'Row' | 'Column', position: 'Before' | 'After') => {
      const command = `add${type}${position}` as const;
      return () => editor.chain().focus()[command]().run();
    },
    [editor],
  );

  const deleteRowOrColumn = useCallback(
    (type: 'Row' | 'Column') => {
      const command = `delete${type}` as const;
      return () => editor.chain().focus()[command]().run();
    },
    [editor],
  );

  const toggleHeader = useCallback(
    (type: 'Row' | 'Column') => {
      const command = `toggleHeader${type}` as const;
      return () => editor.chain().focus()[command]().run();
    },
    [editor],
  );

  const mergeCells = useCallback(
    () => editor.chain().focus().mergeCells().run(),
    [editor],
  );
  const splitCell = useCallback(
    () => editor.chain().focus().splitCell().run(),
    [editor],
  );
  const deleteTable = useCallback(
    () => editor.chain().focus().deleteTable().run(),
    [editor],
  );

  const bubbleMenuProps: Partial<BubbleMenuProps> = {
    editor,
    pluginKey: 'table-bubble',
    shouldShow,
    updateDelay: 100,
    tippyOptions: {
      placement: 'top',
      maxWidth: 'auto',
      appendTo: () => contentElement.current!,
      getReferenceClientRect,
    },
  };

  return (
    <BubbleMenu {...bubbleMenuProps}>
      <div className='flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5'>
        <MenuButton
          icon={BetweenHorizontalStart}
          tooltip='Add row above'
          onClick={addRowOrColumn('Row', 'Before')}
        />
        <MenuButton
          icon={BetweenHorizontalEnd}
          tooltip='Add row below'
          onClick={addRowOrColumn('Row', 'After')}
        />
        <MenuButton
          icon={BetweenVerticalStart}
          tooltip='Add column before'
          onClick={addRowOrColumn('Column', 'Before')}
        />
        <MenuButton
          icon={BetweenVerticalEnd}
          tooltip='Add column after'
          onClick={addRowOrColumn('Column', 'After')}
        />
        <MenuButton
          icon={TableCellsSplit}
          tooltip='Split cell'
          onClick={splitCell}
        />
        <MenuButton
          icon={TableCellsMerge}
          tooltip='Merge cells'
          onClick={mergeCells}
        />
      </div>
      <div className='flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 p-1.5'>
        <MenuButton
          icon={Rows2}
          tooltip='Toggle row header'
          onClick={toggleHeader('Row')}
        />
        <MenuButton
          icon={Columns2}
          tooltip='Toggle column header'
          onClick={toggleHeader('Column')}
        />
        <MenuButton
          icon={X}
          tooltip='Delete row'
          onClick={deleteRowOrColumn('Row')}
        />
        <MenuButton
          icon={XSquare}
          tooltip='Delete column'
          onClick={deleteRowOrColumn('Column')}
        />
        <MenuButton
          icon={Trash2}
          tooltip='Delete table'
          onClick={deleteTable}
        />
      </div>
    </BubbleMenu>
  );
};

export default TableMenu;
