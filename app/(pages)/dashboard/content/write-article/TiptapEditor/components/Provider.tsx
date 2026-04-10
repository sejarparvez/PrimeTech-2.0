import { type Editor, EditorContent } from '@tiptap/react';
import clsx from 'clsx';
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useRef,
  useState,
} from 'react';
import CodeMirrorEditor from '@/app/(pages)/dashboard/content/write-article/SourceEditor/Editor';
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
  children?: ReactNode;
};

export const TiptapProvider = ({
  children,
  editorOptions,
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

  const editorContent = (
    <div
      className={clsx(
        'flex flex-col rounded-md border text-sm',
        isFullScreen && 'fixed inset-0 z-50',
      )}
    >
      {slotBefore}
      <div className='relative flex max-h-[80vh] min-h-80 flex-1 cursor-text overflow-auto bg-background px-2 md:px-4'>
        {isSourceMode ? (
          <CodeMirrorEditor initialContent={editor.getHTML() || ''} />
        ) : (
          <div className='flex min-h-0 flex-1'>
            <EditorContent
              ref={contentElement}
              editor={editor}
              className='relative mx-auto w-full max-w-180 flex-1'
            />
          </div>
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
