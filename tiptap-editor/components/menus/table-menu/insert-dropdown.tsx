import { PopoverClose } from '@/components/ui/popover';
import { MenuButton } from '../../menu-button';
import { Toolbar } from '../../ui/toolbar';

interface InsertDropdownProps {
  addRowBefore: () => void;
  addRowAfter: () => void;
  addColumnBefore: () => void;
  addColumnAfter: () => void;
}

export const InsertDropdown = ({
  addRowBefore,
  addRowAfter,
  addColumnBefore,
  addColumnAfter,
}: InsertDropdownProps) => {
  return (
    <MenuButton
      type='popover'
      icon='TablePlus'
      dropdownClass='rte-table-insert-dropdown'
      dropdownStyle={{ minWidth: '10rem' }}
    >
      <PopoverClose asChild>
        <Toolbar vertical={true}>
          <MenuButton
            icon='RowInsertTop'
            hideText={false}
            tooltip={false}
            text='Insert row above'
            onClick={addRowBefore}
          />
          <MenuButton
            icon='RowInsertBottom'
            hideText={false}
            tooltip={false}
            text='Insert row below'
            onClick={addRowAfter}
          />
          <MenuButton
            icon='ColInsertLeft'
            hideText={false}
            tooltip={false}
            text='Insert column before'
            onClick={addColumnBefore}
          />
          <MenuButton
            icon='ColInsertRight'
            hideText={false}
            tooltip={false}
            text='Insert column after'
            onClick={addColumnAfter}
          />
        </Toolbar>
      </PopoverClose>
    </MenuButton>
  );
};
