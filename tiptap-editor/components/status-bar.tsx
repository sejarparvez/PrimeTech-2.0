import { useEditorState, useTiptap } from '@tiptap/react';

import { MenuButton } from './menu-button';
import { Toolbar } from './ui/toolbar';

export const StatusBar = () => {
  const { editor } = useTiptap();

  const { fullScreen, sourceView, counter } = useEditorState({
    editor,
    selector: ({ editor }) => {
      const fullScreen = editor.storage.fullScreen.enabled;
      const sourceView = editor.storage.sourceView.enabled;
      const words = editor.storage.characterCount.words();
      const characters = editor.storage.characterCount.characters();

      return { fullScreen, sourceView, counter: { words, characters } };
    },
  });

  return (
    <div className='border-t shrink-0 flex'>
      <Toolbar dense>
        <MenuButton
          icon='SourceCode'
          text='Source Code'
          active={sourceView}
          onMouseDown={(e) => e.preventDefault()}
          onClick={editor.commands.toggleSourceView}
        />
        <MenuButton
          icon='Maximize'
          text='Fullscreen'
          active={fullScreen}
          onMouseDown={(e) => e.preventDefault()}
          onClick={editor.commands.toggleFullScreen}
        />
      </Toolbar>

      <div className='flex items-center ml-auto px-4 gap-4'>
        <span>Words: {counter.words}</span>
        <span>Characters: {counter.characters}</span>
      </div>
    </div>
  );
};

export default StatusBar;
