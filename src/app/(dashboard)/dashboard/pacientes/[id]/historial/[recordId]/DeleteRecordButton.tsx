"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMedicalRecord } from "@/server/actions/medicalRecord";
import { Button } from "@/components/ui/button";

type DeleteRecordButtonProps = {
  recordId: string;
  patientId: string;
};

export function DeleteRecordButton({
  recordId,
  patientId,
}: DeleteRecordButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMedicalRecord(recordId);
      router.push(`/dashboard/pacientes/${patientId}/historial`);
    } catch (error) {
      console.error("Failed to delete record:", error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Confirmar"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <Button variant="destructive" onClick={() => setShowConfirm(true)}>
      Eliminar
    </Button>
  );
}
