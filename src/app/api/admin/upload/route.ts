import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";

/**
 * Issues short-lived upload tokens so the browser can PUT directly to Vercel Blob.
 *
 * Client upload rather than proxying through this function on purpose: a
 * serverless request body is capped around 4.5 MB, which a demo video exceeds
 * immediately. The file never passes through here — only the token request does.
 *
 * SVG is deliberately excluded. It can carry inline <script>, and while blobs are
 * served from a different origin, there is no reason to accept an executable
 * image format for blog illustrations.
 */
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
];

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      // Runs before a token is issued. This is the authorization point: without
      // it, anyone could mint upload tokens against the store.
      onBeforeGenerateToken: async () => {
        await requireAdmin();
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: null,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[upload] stored", blob.pathname);
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[upload] error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
