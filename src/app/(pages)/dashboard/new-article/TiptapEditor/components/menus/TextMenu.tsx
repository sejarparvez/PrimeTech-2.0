import { Separator } from '@/components/ui/separator';
import { useCallback } from 'react';
import { isNodeSelected } from '../../utils/isNodeSelected';
import isTextSelected from '../../utils/isTextSelected';
import { BubbleMenu } from '../BubbleMenu';
import AlignDropdown from '../controls/AlignPopover';
import BoldButton from '../controls/BoldButton';
import HeadingDropdown from '../controls/HeadingDropdown';
import LinkButton from '../controls/LinkButton';
import MoreMarkDropdown from '../controls/MoreMarkPopover';
import { useTiptapContext } from '../Provider';

export const TextMenu = ({ enable }: { enable: boolean }) => {
  const { editor } = useTiptapContext();

  const shouldShow = useCallback(({ view, editor }: any) => {
    if (!view || editor.view.dragging) {
      return false;
    }

    if (isNodeSelected(editor)) {
      return false;
    }

    return isTextSelected(editor);
  }, []);

  if (!enable) return null;

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={'text-bubble'}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: 'top-start',
        maxWidth: 'auto',
        appendTo: 'parent',
      }}
    >
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        <HeadingDropdown />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <BoldButton />
        <MoreMarkDropdown />
        <LinkButton />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <AlignDropdown />
      </div>
    </BubbleMenu>
  );
};

export default TextMenu;
