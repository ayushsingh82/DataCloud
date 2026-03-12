/**
 * Filecoin Storage Service — Real IPFS/Filecoin uploads via Lighthouse SDK
 *
 * Requires LIGHTHOUSE_API_KEY environment variable to be set.
 * Without it, uploads will fail (no mock fallback).
 */

const LIGHTHOUSE_UPLOAD_URL = 'https://upload.lighthouse.storage/api/v0/add';
const LIGHTHOUSE_GATEWAY = 'https://gateway.lighthouse.storage/ipfs';

/**
 * Upload a file buffer to IPFS via Lighthouse
 * @returns The IPFS CID of the uploaded file
 */
export async function uploadToLighthouse(
  fileBuffer: Buffer,
  fileName: string,
): Promise<{ cid: string }> {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'LIGHTHOUSE_API_KEY is not set. Get one at https://files.lighthouse.storage/',
    );
  }

  const formData = new FormData();
  formData.append('file', new Blob([new Uint8Array(fileBuffer)]), fileName);

  const res = await fetch(LIGHTHOUSE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lighthouse upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return { cid: data.Hash };
}

/**
 * Upload JSON data (like query results) to IPFS via Lighthouse
 * @returns The IPFS CID
 */
export async function uploadJsonToLighthouse(
  data: Record<string, unknown>,
  fileName: string,
): Promise<{ cid: string }> {
  const jsonBuffer = Buffer.from(JSON.stringify(data, null, 2));
  return uploadToLighthouse(jsonBuffer, fileName);
}

/**
 * Retrieve a file from IPFS via Lighthouse gateway
 */
export async function retrieveFromLighthouse(cid: string): Promise<Buffer> {
  const res = await fetch(`${LIGHTHOUSE_GATEWAY}/${cid}`);
  if (!res.ok) {
    // Fallback to ipfs.io gateway
    const fallbackRes = await fetch(`https://ipfs.io/ipfs/${cid}`);
    if (!fallbackRes.ok) {
      throw new Error(`Failed to retrieve CID ${cid} from any IPFS gateway`);
    }
    return Buffer.from(await fallbackRes.arrayBuffer());
  }
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Get Lighthouse storage usage stats
 */
export async function getLighthouseStorageStatus(): Promise<{
  available: boolean;
  totalUploads: number;
  totalStorageGB: number;
}> {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  if (!apiKey) {
    return { available: false, totalUploads: 0, totalStorageGB: 0 };
  }

  try {
    const res = await fetch(
      `https://api.lighthouse.storage/api/user/user_data_usage?apiKey=${apiKey}`,
    );
    if (res.ok) {
      const data = await res.json();
      return {
        available: true,
        totalUploads: data.totalUploads || 0,
        totalStorageGB: (data.totalSize || 0) / (1024 * 1024 * 1024),
      };
    }
  } catch (err) {
    console.warn('[Lighthouse] getStorageStatus failed:', (err as Error).message);
  }

  return { available: false, totalUploads: 0, totalStorageGB: 0 };
}

/**
 * Check if Lighthouse is configured
 */
export function isLighthouseConfigured(): boolean {
  return !!process.env.LIGHTHOUSE_API_KEY;
}
