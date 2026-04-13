import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
} from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';

export const setup = [
  html(),
  EditorView.lineWrapping,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  highlightActiveLine(),
  history(),
  foldGutter({
    markerDOM: (open) => {
      const el = document.createElement('span');
      el.textContent = open ? '▾' : '▸';
      return el;
    },
  }),
  drawSelection(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  keymap.of([
    indentWithTab,
    ...defaultKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...closeBracketsKeymap,
    ...searchKeymap,
  ]),
];
