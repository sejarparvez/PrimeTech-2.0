import { memo } from 'react';

import { Separator } from '@/components/ui/separator';
import AlignPopover from './controls/AlignPopover';
import BoldButton from './controls/BoldButton';
import BulletListButton from './controls/BulletListButton';
import HeadingDropdown from './controls/HeadingDropdown';
import ImageButton from './controls/ImageButton';
import InsertDropdown from './controls/InsertDropdown';
import LinkButton from './controls/LinkButton';
import MoreMarkDropdown from './controls/MoreMarkPopover';
import OrderedListButton from './controls/OrderedList';
import RedoButton from './controls/RedoButton';
import TextColorButton from './controls/TextColorButton';
import TextHighlightButton from './controls/TextHighlightButton';
import UndoButton from './controls/UndoButton';

const MenuBar = () => {
  return (
    <div className="flex min-h-10 items-center rounded-t-md border-b bg-background">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        <UndoButton />
        <RedoButton />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <HeadingDropdown />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <BoldButton />
        <MoreMarkDropdown />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <TextColorButton />
        <TextHighlightButton />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <AlignPopover />
        <BulletListButton />
        <OrderedListButton />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <LinkButton />
        <ImageButton />
        <InsertDropdown />
      </div>
    </div>
  );
};

export default memo(MenuBar);
