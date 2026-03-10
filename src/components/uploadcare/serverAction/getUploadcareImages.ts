"use server";

import { listOfFiles, UploadcareSimpleAuthSchema } from "@uploadcare/rest-client";

export async function getUploadcareImages({ pubkey, limit }: { pubkey: string; limit?: number,}) {
  if(!pubkey) return {
    images: [],
  }
  const publicKey = pubkey;
  const secretKey = process.env.UPLOADCARE_SECRET_KEY!;

  const auth = new UploadcareSimpleAuthSchema({
    publicKey,
    secretKey,
  });

  const result = await listOfFiles({ limit }, { authSchema: auth });

const images: string[] =
  result.results
    ?.filter((f) => f.isImage)
    .map((f) => f.originalFileUrl)
    .filter((url): url is string => !!url) ?? [];

  return {
    images
  }

}
