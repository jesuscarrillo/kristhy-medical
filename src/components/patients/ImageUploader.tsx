"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadMedicalImage } from "@/server/actions/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  documentTypeValues,
  documentTypeLabels,
} from "@/lib/validators/medicalImage";

type ImageUploaderProps = {
  patientId: string;
};

export function ImageUploader({ patientId }: ImageUploaderProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    fileType: "document",
    documentType: "",
    description: "",
    documentDate: "",
    laboratory: "",
    physician: "",
    results: "",
    isNormal: "",
    tags: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de archivo no permitido.");
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("patientId", patientId);
      uploadData.append("fileType", formData.fileType);

      if (formData.documentType) uploadData.append("documentType", formData.documentType);
      if (formData.description) uploadData.append("description", formData.description);
      if (formData.documentDate) uploadData.append("documentDate", formData.documentDate);
      if (formData.laboratory) uploadData.append("laboratory", formData.laboratory);
      if (formData.physician) uploadData.append("physician", formData.physician);
      if (formData.results) uploadData.append("results", formData.results);
      if (formData.isNormal) uploadData.append("isNormal", formData.isNormal);
      if (formData.tags) uploadData.append("tags", formData.tags);

      await uploadMedicalImage(uploadData);
      input.value = "";
      setFormData({
        fileType: "document",
        documentType: "",
        description: "",
        documentDate: "",
        laboratory: "",
        physician: "",
        results: "",
        isNormal: "",
        tags: "",
      });
      router.refresh();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("No se pudo subir el archivo.");
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
          accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
          disabled={uploading}
        />
        <p className="text-xs text-slate-500">
          Formatos: JPEG, PNG, GIF, WebP, PDF. Máximo 10MB.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fileType">Tipo de archivo</Label>
          <select
            id="fileType"
            value={formData.fileType}
            onChange={(e) => handleChange("fileType", e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            disabled={uploading}
          >
            <option value="document">Documento</option>
            <option value="image">Imagen médica</option>
            <option value="report">Informe</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de documento</Label>
          <select
            id="documentType"
            value={formData.documentType}
            onChange={(e) => handleChange("documentType", e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            disabled={uploading}
          >
            <option value="">Selecciona (opcional)</option>
            {documentTypeValues.map((type) => (
              <option key={type} value={type}>
                {documentTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descripción breve del documento"
          disabled={uploading}
        />
      </div>

      {/* Toggle additional details */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        {showDetails ? "▼ Ocultar detalles" : "▶ Mostrar más detalles"}
      </button>

      {showDetails && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="documentDate">Fecha del documento</Label>
              <Input
                id="documentDate"
                type="date"
                value={formData.documentDate}
                onChange={(e) => handleChange("documentDate", e.target.value)}
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isNormal">Resultado</Label>
              <select
                id="isNormal"
                value={formData.isNormal}
                onChange={(e) => handleChange("isNormal", e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                disabled={uploading}
              >
                <option value="">No especificado</option>
                <option value="true">Normal</option>
                <option value="false">Anormal</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="laboratory">Laboratorio/Centro</Label>
              <Input
                id="laboratory"
                value={formData.laboratory}
                onChange={(e) => handleChange("laboratory", e.target.value)}
                placeholder="Nombre del laboratorio"
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physician">Médico/Especialista</Label>
              <Input
                id="physician"
                value={formData.physician}
                onChange={(e) => handleChange("physician", e.target.value)}
                placeholder="Nombre del médico"
                disabled={uploading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Resultados/Notas</Label>
            <Textarea
              id="results"
              rows={3}
              value={formData.results}
              onChange={(e) => handleChange("results", e.target.value)}
              placeholder="Resumen de los resultados..."
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="Separadas por coma: urgente, seguimiento, etc."
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir archivo"}
      </Button>
    </form>
  );
}
