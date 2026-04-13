import {
  type Editor,
  getMarkRange,
  useEditorState,
  useTiptap,
} from '@tiptap/react';
import { useCallback } from 'react';

export interface LinkData {
  href: string;
  text: string;
  target?: string;
}

export interface LinkState {
  link: LinkData | null;
  isActive: boolean;
  canSet: boolean;
  shouldShow: boolean;
}

export function canSetLink(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.can().setMark('link');
}

export function isLinkActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.storage.link.menuState !== 'hidden';
}

export function getCurrentLink(editor: Editor | null): LinkData | null {
  if (!editor || !isLinkActive(editor)) return null;
  const { href = '', target } = editor.getAttributes('link');
  const { selection, schema, doc } = editor.state;
  const range = getMarkRange(selection.$anchor, schema.marks.link);
  const from = range ? range.from : selection.from;
  const to = range ? range.to : selection.to;
  const text = doc.textBetween(from, to);
  return { href, text, target };
}

export function useLink() {
  const { editor } = useTiptap();

  const editorState = useEditorState({
    editor,
    selector: ({ editor }): LinkState => ({
      link: getCurrentLink(editor),
      isActive: isLinkActive(editor),
      canSet: canSetLink(editor),
      shouldShow: editor.storage.link.menuState !== 'hidden',
    }),
  });

  const setLink = useCallback(
    (href: string, text?: string, target?: string) => {
      const chain = editor.chain().focus();
      const isSelectionEmpty = editor.state.selection.empty;
      const attrs = { href, target: target ?? '_self' };

      if (isSelectionEmpty || text) {
        const linkText = text || href;
        return chain
          .insertContent({
            type: 'text',
            text: linkText,
            marks: [{ type: 'link', attrs }],
          })
          .run();
      }

      return chain.extendMarkRange('link').setLink(attrs).run();
    },
    [editor],
  );

  const unsetLink = useCallback(() => {
    return editor.chain().focus().extendMarkRange('link').unsetLink().run();
  }, [editor]);

  const openMenu = useCallback(() => {
    editor.commands.openLinkMenu();
  }, [editor]);

  const closeMenu = useCallback(() => {
    editor.commands.closeLinkMenu();
  }, [editor]);

  return {
    ...editorState,
    setLink,
    unsetLink,
    openMenu,
    closeMenu,
  };
}
