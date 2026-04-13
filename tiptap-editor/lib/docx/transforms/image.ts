import { AlignmentType, type IImageOptions, ImageRun, Paragraph } from 'docx';
import type { DocxExporter } from '../exporter';
import type { TiptapNode } from '../types';
import { fetchImageInfo, twipToPixel } from '../utils';

export async function processImage(
  node: TiptapNode,
  exporter: DocxExporter,
): Promise<Paragraph> {
  const { src, alt, caption, width: widthPercent } = node.attrs || {};
  const { data, type, dimensions } = await fetchImageInfo(src);

  const availableWidth = twipToPixel(exporter.availableWidth);
  const targetWidth = widthPercent
    ? Math.round((availableWidth * widthPercent) / 100)
    : Math.min(availableWidth, dimensions.width);
  const targetHeight = Math.round(
    targetWidth * (dimensions.height / dimensions.width),
  );

  const imageConfig: IImageOptions = {
    data,
    type,
    transformation: {
      width: targetWidth,
      height: targetHeight,
    },
    ...(alt && {
      altText: {
        name: alt,
        title: alt,
        description: alt,
      },
    }),
    ...(type === 'svg' && {
      fallback: {
        data: '',
        type: 'jpg',
      },
    }),
  };

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      before: 120,
      after: caption ? 0 : 120,
    },
    children: [new ImageRun(imageConfig)],
  });
}
