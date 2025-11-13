import CodeMirrorEditor from '@/app/(pages)/dashboard/new-article/SourceEditor/Editor';
import { EditorContent, type Editor } from '@tiptap/react';
import clsx from 'clsx';
import {
  createContext,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useContext,
  useRef,
  useState,
} from 'react';
import useTiptapEditor, {
  type UseTiptapEditorOptions,
} from '../hooks/useTiptapEditor';

type TiptapContextType = {
  editor: Editor;
  contentElement: RefObject<HTMLDivElement | null>;
  isFullScreen: boolean;
  isResizing: boolean;
  isSourceMode: boolean;
  toggleFullScreen: () => void;
  toggleSourceMode: () => void;
  setIsResizing: (value: boolean) => void;
};

const TiptapContext = createContext<TiptapContextType>({} as TiptapContextType);
export const useTiptapContext = () => useContext(TiptapContext);

type TiptapProviderProps = {
  slotBefore?: ReactNode;
  slotAfter?: ReactNode;
  editorOptions: UseTiptapEditorOptions;
  editorProps?: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
};

export const TiptapProvider = ({
  children,
  editorOptions,
  editorProps,
  slotBefore,
  slotAfter,
}: TiptapProviderProps) => {
  const contentElement = useRef<HTMLDivElement>(null);
  const editor = useTiptapEditor(editorOptions);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  if (!editor) {
    return null;
  }

  const focusEditorViaContainer = (event: React.MouseEvent) => {
    const target = event.target as Element;
    const content = contentElement.current;
    if (content && target.contains(content)) {
      content.style.display = 'flex';
      setTimeout(() => {
        content.style.display = '';
      }, 0);
    }
  };

  const editorContent = (
    <div
      className={clsx(
        'flex flex-col rounded-md border text-sm',
        isFullScreen && 'fixed inset-0 z-50'
      )}
    >
      {slotBefore}
      <div
        className="relative flex max-h-[80vh] min-h-80 flex-1 cursor-text overflow-auto bg-background px-2 md:px-4"
        onMouseDown={focusEditorViaContainer}
      >
        {isSourceMode ? (
          <CodeMirrorEditor initialContent={editor.getHTML() || ''} />
        ) : (
          <EditorContent
            ref={contentElement}
            editor={editor}
            className="relative mx-auto w-full max-w-[45rem] flex-1"
          />
        )}
      </div>
      {children}
      {slotAfter}
    </div>
  );

  return (
    <TiptapContext.Provider
      value={{
        editor,
        contentElement,
        isFullScreen,
        isResizing,
        isSourceMode,
        setIsResizing,
        toggleFullScreen: () => setIsFullScreen((prev) => !prev),
        toggleSourceMode: () => setIsSourceMode((prev) => !prev),
      }}
    >
      {editorContent}
    </TiptapContext.Provider>
  );
};

export default TiptapProvider;
