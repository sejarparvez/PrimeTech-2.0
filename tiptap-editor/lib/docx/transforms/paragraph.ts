import { AlignmentType, type IParagraphOptions, Paragraph } from 'docx';
import type { DocxExporter } from '../exporter';
import type { TiptapNode } from '../types';
import { lineHeightToDocx } from '../utils';

const ALIGNMENT_MAP = {
  left: AlignmentType.LEFT,
  right: AlignmentType.RIGHT,
  center: AlignmentType.CENTER,
  justify: AlignmentType.BOTH,
} as const;

export function processParagraph(
  node: TiptapNode,
  exporter: DocxExporter,
  options: IParagraphOptions = {},
): Paragraph {
  const { run, spacing, ...paragraphOptions } = options;

  const alignment =
    ALIGNMENT_MAP[node.attrs?.textAlign as keyof typeof ALIGNMENT_MAP];
  const lineHeight = lineHeightToDocx(node.attrs?.lineHeight || 1.15);

  return new Paragraph({
    alignment,
    spacing: {
      line: lineHeight,
      ...spacing,
    },
    children: exporter.transformInline(node.content, run),
    ...paragraphOptions,
  });
}
