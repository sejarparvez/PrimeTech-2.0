import { useEditorState, useTiptap } from '@tiptap/react';
import { PopoverClose } from '@/components/ui/popover';
import {
  canToggleMark,
  isMarkActive,
  type MarkType,
} from '../../hooks/use-mark';
import { MenuButton } from '../menu-button';
import { Toolbar } from '../ui/toolbar';
import AlignCenterButton from './align-center-button';
import AlignJustifyButton from './align-justify-button';
import AlignLeftButton from './align-left-button';
import AlignRightButton from './align-right-button';
import BoldButton from './bold-button';
import BulletListButton from './bullet-list-button';
import CodeButton from './code-button';
import ItalicButton from './italic-button';
import OrderedListButton from './ordered-list-button';
import StrikeButton from './strike-button';
import SubscriptButton from './subscript-button';
import SuperscriptButton from './superscript-button';
import UnderlineButton from './underline-button';

const TEXT_MARKS: MarkType[] = ['bold', 'italic', 'underline'];
const EXTRA_MARKS: MarkType[] = ['strike', 'superscript', 'subscript', 'code'];

const CompactFormatPopover = () => {
  const { editor } = useTiptap();

  const editorState = useEditorState({
    editor,
    selector({ editor }) {
      const textActive = TEXT_MARKS.some((mark) => isMarkActive(editor, mark));
      const extraActive = EXTRA_MARKS.some((mark) =>
        isMarkActive(editor, mark),
      );
      const textCanToggle = TEXT_MARKS.some((mark) =>
        canToggleMark(editor, mark),
      );
      const extraCanToggle = EXTRA_MARKS.some((mark) =>
        canToggleMark(editor, mark),
      );

      return {
        isAnyActive: textActive || extraActive,
        canToggle: textCanToggle || extraCanToggle,
      };
    },
  });

  return (
    <MenuButton
      type='popover'
      icon='LetterCase'
      tooltip='Format'
      active={editorState?.isAnyActive}
      disabled={!editorState?.canToggle}
    >
      <PopoverClose asChild>
        <Toolbar dense className='gap-1'>
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-muted-foreground px-1'>Text</div>
            <div className='flex gap-1'>
              <BoldButton />
              <ItalicButton />
              <UnderlineButton />
            </div>
          </div>
          <div className='w-px h-8 bg-border mx-1' />
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-muted-foreground px-1'>Effects</div>
            <div className='flex gap-1'>
              <StrikeButton />
              <SuperscriptButton />
              <SubscriptButton />
              <CodeButton />
            </div>
          </div>
        </Toolbar>
      </PopoverClose>
    </MenuButton>
  );
};

const CompactListsPopover = () => {
  const { editor } = useTiptap();

  const editorState = useEditorState({
    editor,
    selector({ editor }) {
      const isAlignActive = ['left', 'center', 'right', 'justify'].some(
        (align) => editor.isActive({ textAlign: align }),
      );
      const isListActive =
        editor.isActive('bulletList') || editor.isActive('orderedList');
      return { isAnyActive: isAlignActive || isListActive };
    },
  });

  return (
    <MenuButton
      type='popover'
      icon='TaskList'
      tooltip='Lists & Align'
      active={editorState?.isAnyActive}
    >
      <PopoverClose asChild>
        <Toolbar dense className='gap-1'>
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-muted-foreground px-1'>Alignment</div>
            <div className='flex gap-1'>
              <AlignLeftButton />
              <AlignCenterButton />
              <AlignRightButton />
              <AlignJustifyButton />
            </div>
          </div>
          <div className='w-px h-8 bg-border mx-1' />
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-muted-foreground px-1'>Lists</div>
            <div className='flex gap-1'>
              <BulletListButton />
              <OrderedListButton />
            </div>
          </div>
        </Toolbar>
      </PopoverClose>
    </MenuButton>
  );
};

export { CompactFormatPopover, CompactListsPopover };
