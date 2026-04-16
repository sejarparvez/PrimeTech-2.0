import type { UploadApiResponse } from 'cloudinary';
import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export const dynamic = 'force-dynamic';

interface CloudinaryImageResult {
  id: string;
  url: string;
  created_at: string;
  bytes: number;
  format: string;
  display_name: string;
  width: number;
  height: number;
}

interface SearchResource {
  public_id: string;
  secure_url: string;
  created_at: string;
  bytes: number;
  format: string;
  display_name: string;
  width: number;
  height: number;
}

function mapCloudinaryResource(item: SearchResource): CloudinaryImageResult {
  return {
    id: item.public_id,
    url: item.secure_url,
    created_at: item.created_at,
    bytes: item.bytes,
    format: item.format,
    display_name: item.display_name || item.public_id,
    width: item.width,
    height: item.height,
  };
}

function mapUploadResult(result: UploadApiResponse): CloudinaryImageResult {
  return {
    id: result.public_id,
    url: result.secure_url,
    created_at: result.created_at,
    bytes: result.bytes,
    format: result.format,
    display_name: result.display_name || result.public_id,
    width: result.width,
    height: result.height,
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function GET() {
  try {
    const response = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    return NextResponse.json<CloudinaryImageResult[]>(
      (response.resources as SearchResource[]).map(mapCloudinaryResource),
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();

    if (bytes.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds 5MB size limit' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(bytes);
    const fileName = file.name.replace(/\.[^.]+$/, '');

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: fileName,
          resource_type: 'image',
          invalidate: true,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('No result returned from Cloudinary'));
        },
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json<CloudinaryImageResult>(mapUploadResult(result));
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    );
  }
}
