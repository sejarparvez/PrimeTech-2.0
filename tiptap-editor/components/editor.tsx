import {
  type Content,
  type Editor,
  TiptapContent,
  Tiptap as TiptapProvider,
  type UseEditorOptions,
  useEditor,
} from '@tiptap/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { createExtensions } from '../extensions';
import { getEditorContent } from '../helpers/tiptap';
import { cssVar, throttle } from '../helpers/utils';
import DragHandle from './drag-handle';
import MenuBar from './menu-bar';
import Menus from './menus';
import Resizer from './resizer';
import StatusBar from './status-bar';

import '../styles/index.scss';

export type TiptapEditorProps2 = Omit<
  UseEditorOptions,
  'onUpdate' | 'extensions' | 'content'
> & {
  disabled?: boolean;
  minHeight?: string | number;
  maxHeight?: string | number;
  maxWidth?: string | number;
  placeholder?: string | Record<string, string>;
  output: 'html' | 'json';
  delay?: number;
  content?: Content;
  onChange?: (value: Content) => void;
};

export type TiptapEditorRef = Editor | null;

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps2>(
  (props, ref) => {
    const {
      output = 'html',
      editable = true,
      disabled = false,
      delay = 1500,
      immediatelyRender = false,
      minHeight = 320,
      maxHeight,
      maxWidth,
      placeholder,
      content,
      onChange,
      ...restProps
    } = props;
    const isEditable = editable && !disabled;

    const throttledUpdate = useCallback(
      throttle(({ editor }: { editor: Editor }) => {
        if (!onChange) return;
        const content = getEditorContent(editor, output);
        onChange(content);
      }, delay),
      [onChange, output, delay],
    );

    const extensions = useMemo(
      () => createExtensions({ placeholder }),
      [placeholder],
    );

    const editor = useEditor({
      ...restProps,
      content,
      editable: isEditable,
      extensions,
      immediatelyRender,
      editorProps: {
        ...restProps.editorProps,
        attributes: {
          spellcheck: 'false',
          ...restProps.editorProps?.attributes,
        },
      },
      onUpdate: throttledUpdate,
    });

    useImperativeHandle(ref, () => editor);

    useEffect(() => {
      if (!editor || editor.isEditable === isEditable) return;
      editor.setEditable(isEditable);
      editor.view.dispatch(editor.view.state.tr);
    }, [editor, isEditable]);

    useEffect(() => {
      cssVar('--rte-editor-min-height', minHeight, 'px');
      cssVar('--rte-editor-max-height', maxHeight, 'px');
      cssVar('--rte-editor-max-width', maxWidth, 'px');
    }, [minHeight, maxHeight, maxWidth]);

    if (!editor) {
      return null;
    }

    return (
      <TiptapProvider editor={editor}>
        <div className='rte-editor'>
          <div className='rte-editor__container'>
            <MenuBar />

            <TiptapContent className='rte-editor__content'>
              <Menus />
              <DragHandle />
              <Resizer />
            </TiptapContent>

            <StatusBar />
          </div>
        </div>
      </TiptapProvider>
    );
  },
);

TiptapEditor.displayName = 'TiptapEditor';

export default TiptapEditor;
