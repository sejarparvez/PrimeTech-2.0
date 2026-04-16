import CompactColorPopover from './controls/compact-color-popover';
import {
  CompactFormatPopover,
  CompactListsPopover,
} from './controls/compact-format-popover';
import EmojiPopover from './controls/emoji-popover';
import HeadingDropdown from './controls/heading-dropdown';
import ImageButton from './controls/image-button-2';
import InsertDropdown from './controls/insert-dropdown';
import LinkButton from './controls/link-button';
import RedoButton from './controls/redo-button';
import TableButton from './controls/table-button';
import UndoButton from './controls/undo-button';
import { Toolbar, ToolbarDivider, ToolbarGroup } from './ui/toolbar';

export const MenuBar = () => {
  return (
    <Toolbar dense className='rte-menu-bar'>
      <ToolbarGroup>
        <UndoButton />
        <RedoButton />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <HeadingDropdown />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <CompactFormatPopover />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <CompactColorPopover />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <CompactListsPopover />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <LinkButton />
        <ImageButton />
        <TableButton />
        <EmojiPopover />
        <InsertDropdown />
      </ToolbarGroup>
    </Toolbar>
  );
};

export default MenuBar;
