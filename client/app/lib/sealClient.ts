import { useSuiClient } from "@mysten/dapp-kit";
import { SealClient } from "@mysten/seal";

const serverObjectIds = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8"
];

// Custom hook to create SealClient instance
export function useSealClient() {
  const suiClient = useSuiClient();
  return new SealClient({
    suiClient: suiClient as unknown as any,
    serverConfigs: serverObjectIds.map((id) => ({
      objectId: id,
      weight: 1,
    })),
    verifyKeyServers: false,
  });
}

export async function encryptData(
  client: SealClient,
  packageId: string,
  id: string,
  data: Uint8Array
): Promise<{ encryptedBytes: Uint8Array, backupKey: Uint8Array }> {
  const { encryptedObject: encryptedBytes, key: backupKey } = await client.encrypt({
    threshold: 2,
    packageId: packageId,
    id: id,
    data,
  });
  return { encryptedBytes, backupKey };
}