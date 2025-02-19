import { findChildren } from '@tiptap/core';
import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import {
  ExtendedRegExpMatchArray,
  isNodeActive,
  textblockTypeInputRule,
} from '@tiptap/react';
import highlight from 'highlight.js/lib/core';
import { CODE_BLOCK_LANGUAGUE_SYNTAX_DEFAULT } from '../constants/code-languages';
import { findLanguage, loadLanguage } from '../utils/codeLanguageLoader';

import plaintext from 'highlight.js/lib/languages/plaintext';
import { createLowlight } from 'lowlight';

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;

const lowlight = createLowlight();
lowlight.register('plaintext', plaintext);

export const CodeBlock = TiptapCodeBlockLowlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: CODE_BLOCK_LANGUAGUE_SYNTAX_DEFAULT,
    };
  },

  addInputRules() {
    const findAndLoadLanguage = (match: ExtendedRegExpMatchArray) => {
      const language = findLanguage(match[1]);
      const syntax = language?.syntax || CODE_BLOCK_LANGUAGUE_SYNTAX_DEFAULT;
      loadLanguage(syntax, lowlight);
      return { language: syntax };
    };

    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
        getAttributes: findAndLoadLanguage,
      }),
      textblockTypeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: findAndLoadLanguage,
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      LowlightPlugin({
        lowlight,
        name: this.name,
        defaultLanguage: CODE_BLOCK_LANGUAGUE_SYNTAX_DEFAULT,
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        const { state, view } = editor;
        if (isNodeActive(editor.state, this.type)) {
          view.dispatch(state.tr.insertText('\t'));
          return true;
        }
        return false;
      },
    };
  },
}).configure({
  lowlight,
});

export const LowlightPluginKey = new PluginKey('lowlight');

export function LowlightPlugin({
  name,
  lowlight,
  defaultLanguage,
}: {
  name: string;
  lowlight: any;
  defaultLanguage: string | null | undefined;
}) {
  const lowlightPlugin: Plugin<any> = new Plugin({
    key: LowlightPluginKey,

    state: {
      init(_, { doc }) {
        return getDecorations({
          doc,
          name,
          lowlight,
          defaultLanguage,
        });
      },

      apply(tr, decorationSet, oldState, newState) {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name
        );
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name
        );

        const didChangeSomeCodeBlock =
          tr.docChanged &&
          ([oldNodeName, newNodeName].includes(name) ||
            newNodes.length !== oldNodes.length ||
            tr.steps.some((step) => {
              return (
                // @ts-ignore
                step.from !== undefined &&
                // @ts-ignore
                step.to !== undefined &&
                oldNodes.some((node) => {
                  return (
                    // @ts-ignore
                    node.pos >= step.from &&
                    // @ts-ignore
                    node.pos + node.node.nodeSize <= step.to
                  );
                })
              );
            }));

        const languageLoaded = Boolean(tr.getMeta(LowlightPluginKey));

        if (languageLoaded || didChangeSomeCodeBlock) {
          return getDecorations({
            doc: tr.doc,
            name,
            lowlight,
            defaultLanguage,
          });
        }

        return decorationSet.map(tr.mapping, tr.doc);
      },
    },

    view(view) {
      class LowlightPluginView {
        constructor() {
          this.initDecorations();
        }

        update() {
          this.checkUndecoratedBlocks();
        }

        async initDecorations() {
          const doc = view.state.doc;
          const codeBlocks = findChildren(
            doc,
            (node) => node.type.name === name
          );

          const languages = [
            ...codeBlocks.map(
              (block) =>
                block.node.attrs.language || CODE_BLOCK_LANGUAGUE_SYNTAX_DEFAULT
            ),
            defaultLanguage,
          ];

          await Promise.all(
            languages.map((language) => loadLanguage(language, lowlight))
          );

          const tr = view.state.tr.setMeta(LowlightPluginKey, true);
          view.dispatch(tr);
        }

        async checkUndecoratedBlocks() {
          const codeBlocks = findChildren(
            view.state.doc,
            (node) => node.type.name === name
          );

          const loadStates = await Promise.all(
            codeBlocks.flatMap((block) => [
              loadLanguage(
                block.node.attrs.language ||
                  CODE_BLOCK_LANGUAGUE_SYNTAX_DEFAULT,
                lowlight
              ),
            ])
          );
          const didLoadSomething = loadStates.includes(true);

          if (didLoadSomething) {
            const tr = view.state.tr.setMeta(LowlightPluginKey, true);
            view.dispatch(tr);
          }
        }
      }

      return new LowlightPluginView();
    },

    props: {
      decorations(this, state) {
        return this.getState(state);
      },
    },
  });

  return lowlightPlugin;
}

function parseNodes(
  nodes: any[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [
        ...className,
        ...(node.properties ? node.properties.className : []),
      ];

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes,
      };
    })
    .flat();
}

function getHighlightNodes(result: any) {
  return result.value || result.children || [];
}

function registered(aliasOrLanguage: string) {
  return Boolean(highlight.getLanguage(aliasOrLanguage));
}

function getDecorations({
  doc,
  name,
  lowlight,
  defaultLanguage,
}: {
  doc: ProsemirrorNode;
  name: string;
  lowlight: any;
  defaultLanguage: string | null | undefined;
}) {
  const decorations: Decoration[] = [];

  const codeBlocks = findChildren(doc, (node) => node.type.name === name);

  codeBlocks.forEach((block) => {
    let from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    const languages = lowlight.listLanguages();

    const nodes =
      language && (languages.includes(language) || registered(language))
        ? getHighlightNodes(
            lowlight.highlight(language, block.node.textContent)
          )
        : getHighlightNodes(lowlight.highlightAuto(block.node.textContent));

    parseNodes(nodes).forEach((node) => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(' '),
        });

        decorations.push(decoration);
      }

      from = to;
    });
  });

  return DecorationSet.create(doc, decorations);
}
