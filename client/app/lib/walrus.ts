export async function uploadQuiltToWalrus(files: File[]): Promise<{ quiltId: string; patchIds: Record<string,string> }> {
  const publisher = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER!;
  const form = new FormData();
  for (let i = 0; i < files.length; i++) {
    form.append(`file${i}`, files[i]);
  }

  const res = await fetch(`${publisher}/v1/quilts`, {
    method: "PUT",
    body: form,
  });
  if (!res.ok) throw new Error("Quilt upload failed: " + res.status);

  const json = await res.json();
  const quiltId = json.newlyCreated?.blobObject?.blobId;
  const stored = json.storedQuiltBlobs; // array of { identifier, quiltPatchId }

  const patchIds: Record<string, string> = {};
  stored.forEach((b: any) => {
    patchIds[b.identifier] = b.quiltPatchId;
  });

  return { quiltId, patchIds };
}
