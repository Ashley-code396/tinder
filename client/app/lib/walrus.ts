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

  // ✅ Correct path to quiltId
  const quiltId = json.blobStoreResult?.newlyCreated?.blobObject?.blobId;
  if (!quiltId) {
    console.error("Upload response:", json);
    throw new Error("Quilt upload failed: no Quilt ID returned");
  }

  const stored = json.storedQuiltBlobs; // array of { identifier, quiltPatchId }

  const patchIds: Record<string, string> = {};
  stored.forEach((b: any) => {
    patchIds[b.identifier] = b.quiltPatchId;
  });

  return { quiltId, patchIds };
}
