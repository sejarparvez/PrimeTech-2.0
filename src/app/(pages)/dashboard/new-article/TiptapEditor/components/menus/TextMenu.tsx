import { useCallback } from 'react';
import { isNodeSelected } from '../../utils/isNodeSelected';
import isTextSelected from '../../utils/isTextSelected';
import { BubbleMenu } from '../BubbleMenu';
import AlignDropdown from '../controls/AlignPopover';
import BoldButton from '../controls/BoldButton';
import HeadingDropdown from '../controls/HeadingDropdown';
import LinkButton from '../controls/LinkButton';
import MoreMarkDropdown from '../controls/MoreMarkPopover';
import UnderlineButton from '../controls/UnderlineButton';
import { useTiptapContext } from '../Provider';
import { Toolbar, ToolbarDivider } from '../ui/Toolbar';

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
      <Toolbar>
        <HeadingDropdown />

        <ToolbarDivider />

        <BoldButton />

        <UnderlineButton />
        <MoreMarkDropdown />
        <LinkButton />

        <ToolbarDivider />

        <AlignDropdown />
      </Toolbar>
    </BubbleMenu>
  );
};

export default TextMenu;
