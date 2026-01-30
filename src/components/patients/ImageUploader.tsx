"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadMedicalImage } from "@/server/actions/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploaderProps = {
  patientId: string;
};

export function ImageUploader({ patientId }: ImageUploaderProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState("ultrasound");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const input = event.currentTarget.elements.namedItem("file") as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      setError("Selecciona un archivo para subir.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Archivo muy grande (máx 10 MB).");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de archivo no permitido.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patientId", patientId);
      formData.append("fileType", fileType);
      await uploadMedicalImage(formData);
      input.value = "";
      router.refresh();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Archivo</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          disabled={uploading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fileType">Tipo de estudio</Label>
        <select
          id="fileType"
          value={fileType}
          onChange={(event) => setFileType(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          disabled={uploading}
        >
          <option value="ultrasound">Ecografía</option>
          <option value="xray">Rayos X</option>
          <option value="lab">Laboratorio</option>
          <option value="document">Documento</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir archivo"}
      </Button>
    </form>
  );
}
