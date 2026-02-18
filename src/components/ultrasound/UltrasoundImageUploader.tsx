"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadUltrasoundImage, deleteUltrasoundImage } from "@/server/actions/ultrasound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UltrasoundImage = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  description?: string | null;
  createdAt: Date;
};

type UltrasoundImageUploaderProps = {
  ultrasoundId: string;
  images: UltrasoundImage[];
};

export function UltrasoundImageUploader({
  ultrasoundId,
  images,
}: UltrasoundImageUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Solo se permiten imágenes (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("El archivo no puede superar 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ultrasoundId", ultrasoundId);
      if (description) {
        formData.append("description", description);
      }

      await uploadUltrasoundImage(formData);
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al subir imagen";
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    setDeletingId(imageId);
    try {
      await deleteUltrasoundImage(imageId);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error al eliminar imagen");
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h3 className="font-medium">Subir nueva imagen</h3>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Vista sagital del feto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Imagen</Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <p className="text-xs text-slate-500">
            Formatos: JPEG, PNG, GIF, WebP. Máximo 10MB.
          </p>
        </div>

        {isUploading && (
          <p className="text-sm text-blue-600">Subiendo imagen...</p>
        )}
        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium">Imágenes ({images.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg border border-slate-200 overflow-hidden"
              >
                <a
                  href={image.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-video bg-slate-100 relative"
                >
                  <Image
                    src={image.fileUrl}
                    alt={image.description || image.fileName}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </a>
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium truncate">{image.fileName}</p>
                  {image.description && (
                    <p className="text-xs text-slate-500 truncate">{image.description}</p>
                  )}
                  <p className="text-xs text-slate-400">{formatFileSize(image.fileSize)}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                >
                  {deletingId === image.id ? "..." : "X"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">
          No hay imágenes. Sube la primera imagen de la ecografía.
        </p>
      )}
    </div>
  );
}
