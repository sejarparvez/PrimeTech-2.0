import { useEditorState } from '@tiptap/react';
import { memo } from 'react';
import MenuButton from './MenuButton';
import { useTiptapContext } from './Provider';

const StatusBar = () => {
  const {
    editor,
    isFullScreen,
    isSourceMode,
    toggleFullScreen,
    toggleSourceMode,
  } = useTiptapContext();
  const counter = useEditorState({
    editor,
    selector: (ctx) => ({
      words: ctx.editor.storage.characterCount.words(),
      characters: ctx.editor.storage.characterCount.characters(),
    }),
  });

  return (
    <div className="flex min-h-11 items-center rounded-b-md border-t bg-background">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        <MenuButton
          icon="SourceCode"
          text="Source Code"
          active={isSourceMode}
          onClick={toggleSourceMode}
        />
        <MenuButton
          icon={isFullScreen ? 'Minimize' : 'Maximize'}
          text="Fullscreen"
          active={isFullScreen}
          onClick={toggleFullScreen}
        />
      </div>

      <div className="ml-auto space-x-2 px-2 py-1">
        <span>Words: {counter.words}</span>
        <span>Characters: {counter.characters}</span>
      </div>
    </div>
  );
};

export default memo(StatusBar);
