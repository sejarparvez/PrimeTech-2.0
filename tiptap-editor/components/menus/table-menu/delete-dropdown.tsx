import { PopoverClose } from '@/components/ui/popover';
import { MenuButton } from '../../menu-button';
import { Toolbar } from '../../ui/toolbar';

interface DeleteDropdownProps {
  deleteRow: () => void;
  deleteColumn: () => void;
  deleteTable: () => void;
}

export const DeleteDropdown = ({
  deleteRow,
  deleteColumn,
  deleteTable,
}: DeleteDropdownProps) => {
  return (
    <MenuButton
      type='popover'
      icon='TableMinus'
      dropdownClass='rte-table-delete-dropdown'
      dropdownStyle={{ minWidth: '10rem' }}
    >
      <PopoverClose asChild>
        <Toolbar vertical={true}>
          <MenuButton
            icon='RowRemove'
            hideText={false}
            tooltip={false}
            text='Delete row'
            onClick={deleteRow}
          />
          <MenuButton
            icon='ColRemove'
            hideText={false}
            tooltip={false}
            text='Delete column'
            onClick={deleteColumn}
          />
          <MenuButton
            icon='TableMinus'
            hideText={false}
            tooltip={false}
            text='Delete table'
            onClick={deleteTable}
          />
        </Toolbar>
      </PopoverClose>
    </MenuButton>
  );
};
