/**
 * IPFS Storage Service — Uploads and retrieval via Pinata
 *
 * Requires PINATA_JWT environment variable to be set.
 * Get your JWT at: https://app.pinata.cloud/developers/api-keys
 */

const PINATA_UPLOAD_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

function getPinataGateway(): string {
  return process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud';
}

/**
 * Upload a file buffer to IPFS via Pinata
 * @returns The IPFS CID of the uploaded file
 */
export async function uploadToLighthouse(
  fileBuffer: Buffer,
  fileName: string,
): Promise<{ cid: string }> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error(
      'PINATA_JWT is not set. Get one at https://app.pinata.cloud/developers/api-keys',
    );
  }

  const formData = new FormData();
  formData.append('file', new Blob([new Uint8Array(fileBuffer)]), fileName);

  const metadata = JSON.stringify({ name: fileName });
  formData.append('pinataMetadata', metadata);

  const res = await fetch(PINATA_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Pinata upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return { cid: data.IpfsHash };
}

/**
 * Upload JSON data (like query results) to IPFS via Pinata
 * @returns The IPFS CID
 */
export async function uploadJsonToLighthouse(
  data: Record<string, unknown>,
  fileName: string,
): Promise<{ cid: string }> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error(
      'PINATA_JWT is not set. Get one at https://app.pinata.cloud/developers/api-keys',
    );
  }

  const res = await fetch(PINATA_JSON_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pinataContent: data,
      pinataMetadata: { name: fileName },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Pinata JSON upload failed (${res.status}): ${errorText}`);
  }

  const result = await res.json();
  return { cid: result.IpfsHash };
}

/**
 * Retrieve a file from IPFS via Pinata gateway
 */
export async function retrieveFromLighthouse(cid: string): Promise<Buffer> {
  const gateway = getPinataGateway();
  const res = await fetch(`${gateway}/ipfs/${cid}`);
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
 * Get Pinata storage usage stats
 */
export async function getLighthouseStorageStatus(): Promise<{
  available: boolean;
  totalUploads: number;
  totalStorageGB: number;
}> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return { available: false, totalUploads: 0, totalStorageGB: 0 };
  }

  try {
    const res = await fetch('https://api.pinata.cloud/data/userPinnedDataTotal', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        available: true,
        totalUploads: data.pin_count || 0,
        totalStorageGB: (data.pin_size_total || 0) / (1024 * 1024 * 1024),
      };
    }
  } catch (err) {
    console.warn('[Pinata] getStorageStatus failed:', (err as Error).message);
  }

  return { available: false, totalUploads: 0, totalStorageGB: 0 };
}

/**
 * Check if Pinata is configured
 */
export function isLighthouseConfigured(): boolean {
  return !!process.env.PINATA_JWT;
}
