import { type UseEditorOptions, useEditor } from '@tiptap/react';
import { type Ref, useEffect, useImperativeHandle } from 'react';
import type { TiptapEditorRef } from '../components/Editor';
import useForceUpdate from './useForceUpdate';

export type UseTiptapEditorOptions = UseEditorOptions & {
  ref?: Ref<TiptapEditorRef>;
  placeholder?: {
    paragraph?: string;
    imageCapton?: string;
  };
};

export default function useTiptapEditor({
  ref,
  placeholder,
  ...editorOptions
}: UseTiptapEditorOptions) {
  const forceUpdate = useForceUpdate();
  const editor = useEditor(editorOptions, []);

  useImperativeHandle(
    ref,
    () => ({
      getInstance: () => editor,
    }),
    [editor],
  );

  useEffect(() => {
    const isEditable = editorOptions.editable;
    if (!editor || editor.isEditable === isEditable) return;
    editor.setOptions({ editable: Boolean(isEditable) });
    forceUpdate();
  }, [editor, editorOptions.editable]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, []);

  return editor;
}
