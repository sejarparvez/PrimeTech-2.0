import { useCallback } from 'react';
import { getNodeContainer } from '../../utils/getNodeContainer';
import { BubbleMenu } from '../BubbleMenu';
import MenuButton from '../MenuButton';
import { useTiptapContext } from '../Provider';

const TableMenu = () => {
  const { editor, contentElement } = useTiptapContext();

  const shouldShow = useCallback(({ editor }: any) => {
    return editor.isActive('table');
  }, []);

  const getReferenceClientRect = useCallback(() => {
    const node = getNodeContainer(editor, 'table');
    return node?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);
  }, [editor]);

  const addRowOrColumn = useCallback(
    (type: 'Row' | 'Column', position: 'Before' | 'After') => {
      const command = `add${type}${position}` as const;
      return () => editor.chain().focus()[command]().run();
    },
    [editor]
  );

  const deleteRowOrColumn = useCallback(
    (type: 'Row' | 'Column') => {
      const command = `delete${type}` as const;
      return () => editor.chain().focus()[command]().run();
    },
    [editor]
  );

  const toggleHeader = useCallback(
    (type: 'Row' | 'Column') => {
      const command = `toggleHeader${type}` as const;
      return () => editor.chain().focus()[command]().run();
    },
    [editor]
  );

  const mergeCells = useCallback(
    () => editor.chain().focus().mergeCells().run(),
    [editor]
  );
  const splitCell = useCallback(
    () => editor.chain().focus().splitCell().run(),
    [editor]
  );
  const deleteTable = useCallback(
    () => editor.chain().focus().deleteTable().run(),
    [editor]
  );

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={'table-bubble'}
      shouldShow={shouldShow}
      updateDelay={100}
      tippyOptions={{
        placement: 'top',
        maxWidth: 'auto',
        appendTo: () => contentElement.current!,
        getReferenceClientRect,
      }}
    >
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        <MenuButton
          icon="RowInsertTop"
          tooltip="Add row above"
          onClick={addRowOrColumn('Row', 'Before')}
        />
        <MenuButton
          icon="RowInsertBottom"
          tooltip="Add row below"
          onClick={addRowOrColumn('Row', 'After')}
        />
        <MenuButton
          icon="ColInsertLeft"
          tooltip="Add column before"
          onClick={addRowOrColumn('Column', 'Before')}
        />
        <MenuButton
          icon="ColInsertRight"
          tooltip="Add column after"
          onClick={addRowOrColumn('Column', 'After')}
        />
        <MenuButton icon="SplitCell" tooltip="Split cell" onClick={splitCell} />
        <MenuButton
          icon="MergeCell"
          tooltip="Merge cells"
          onClick={mergeCells}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 p-1.5">
        <MenuButton
          icon="RowHeader"
          tooltip="Toggle row header"
          onClick={toggleHeader('Row')}
        />
        <MenuButton
          icon="ColHeader"
          tooltip="Toggle column header"
          onClick={toggleHeader('Column')}
        />
        <MenuButton
          icon="RowRemove"
          tooltip="Delete row"
          onClick={deleteRowOrColumn('Row')}
        />
        <MenuButton
          icon="ColRemove"
          tooltip="Delete column"
          onClick={deleteRowOrColumn('Column')}
        />
        <MenuButton icon="Trash" tooltip="Delete table" onClick={deleteTable} />
      </div>
    </BubbleMenu>
  );
};

export default TableMenu;
