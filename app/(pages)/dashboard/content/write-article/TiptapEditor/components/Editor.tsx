'use client';
import type { Content, Editor } from '@tiptap/react';
import { forwardRef, useCallback, useEffect } from 'react';

import TableMenu from '@/app/(pages)/dashboard/content/write-article/TiptapEditor/components/menus/TableMenu';
import type { UseTiptapEditorOptions } from '../hooks/useTiptapEditor';
import ExtensionKit from '../kit';
import { cssVar } from '../utils/cssVar';
import { throttle } from '../utils/throttle';
import MenuBar from './MenuBar';
import { CodeBlockMenu, ImageMenu, LinkMenu } from './menus';
import TiptapProvider from './Provider';
// Resizer temporarily disabled - causes click issues
// import Resizer from './Resizer';
import StatusBar from './StatusBar';
export type TiptapEditorRef = {
  getInstance: () => Editor | null;
};

export interface TiptapEditorProps {
  ssr?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  initialContent?: Content;
  placeholder?: {
    paragraph?: string;
    imageCaption?: string;
  };
  output?: 'html' | 'json';
  hideMenuBar?: boolean;
  hideStatusBar?: boolean;
  hideBubbleMenu?: boolean;
  containerClass?: string;
  menuBarClass?: string;
  contentClass?: string;
  contentMinHeight?: string | number;
  contentMaxHeight?: string | number;
  onContentChange?: (value: Content) => void;
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  (
    {
      ssr = false,
      output = 'html',
      readonly = false,
      disabled = false,
      initialContent,
      placeholder,
      hideMenuBar = false,
      hideStatusBar = false,
      hideBubbleMenu = true,
      contentMinHeight = 200,
      contentMaxHeight,
      onContentChange,
    },
    ref,
  ) => {
    const isEditable = !readonly && !disabled;
    const displayBubbleMenu = isEditable && hideBubbleMenu;

    const throttledUpdate = useCallback(
      throttle((value: Content) => onContentChange?.(value), 1500),
      [],
    );

    const handleUpdate = useCallback(
      (editor: Editor) => {
        const content =
          output === 'html'
            ? editor.isEmpty
              ? ''
              : editor.getHTML()
            : editor.getJSON();
        throttledUpdate(content);
      },
      [throttledUpdate, output],
    );

    const editorOptions: UseTiptapEditorOptions = {
      ref,
      extensions: ExtensionKit({ placeholder: placeholder?.paragraph }),
      content: initialContent,
      editable: isEditable,
      immediatelyRender: !ssr,
      shouldRerenderOnTransaction: false,
      autofocus: false,
      onUpdate: ({ editor }) => handleUpdate(editor),
      editorProps: {
        attributes: {
          class:
            'prose prose-neutral relative w-full h-full min-h-0 grow whitespace-pre-wrap py-7 outline-hidden dark:prose-invert [&>p]:mt-5',
          style: 'min-height: 100%; height: 100%;',
        },
      },
    };

    useEffect(() => {
      cssVar('--rte-editor-min-height', `${contentMinHeight}px`);
      cssVar('--rte-editor-max-height', `${contentMaxHeight}px`);
    }, [contentMaxHeight, contentMinHeight]);

    const menus = displayBubbleMenu && (
      <>
        <LinkMenu />
        <ImageMenu />
        <CodeBlockMenu />
        <TableMenu />
      </>
    );

    return (
      <TiptapProvider
        editorOptions={editorOptions}
        slotBefore={!hideMenuBar && <MenuBar />}
        slotAfter={!hideStatusBar && <StatusBar />}
      >
        {menus}
      </TiptapProvider>
    );
  },
);

TiptapEditor.displayName = 'TiptapEditor';

export default TiptapEditor;
