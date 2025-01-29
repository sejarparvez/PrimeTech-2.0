import { useEditor, type UseEditorOptions } from '@tiptap/react';
import { Ref, useEffect, useImperativeHandle } from 'react';
import { TiptapEditorRef } from '../components/Editor';
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
    [editor]
  );

  useEffect(() => {
    const isEditable = editorOptions.editable;
    if (!editor || editor.isEditable === isEditable) return;
    editor.setOptions({ editable: Boolean(isEditable) });
    forceUpdate();
  }, [editor, editorOptions.editable, forceUpdate]);

  useEffect(() => {
    if (!editor) return;
    // @ts-ignore
    editor.setOptions({ editorProps: { placeholder } });
    forceUpdate();
  }, [editor, placeholder, forceUpdate]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return editor;
}
