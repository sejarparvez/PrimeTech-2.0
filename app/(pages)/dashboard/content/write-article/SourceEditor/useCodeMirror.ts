import { html } from '@codemirror/lang-html';
import { EditorState } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { EditorView } from 'codemirror';
import { useEffect, useRef } from 'react';
import { theme } from './theme';

interface UseCodeMirrorProps {
  initialContent: string;
  onChange?: (content: string) => void;
}

export function useCodeMirror({
  initialContent,
  onChange,
}: UseCodeMirrorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        lineNumbers(),
        html(),
        theme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => view.destroy();
  }, [initialContent]);

  return editorRef;
}
