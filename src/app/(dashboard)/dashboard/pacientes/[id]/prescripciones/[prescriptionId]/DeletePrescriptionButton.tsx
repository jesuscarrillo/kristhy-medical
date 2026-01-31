"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePrescription } from "@/server/actions/prescription";
import { Button } from "@/components/ui/button";

type DeletePrescriptionButtonProps = {
  prescriptionId: string;
  patientId: string;
};

export function DeletePrescriptionButton({
  prescriptionId,
  patientId,
}: DeletePrescriptionButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePrescription(prescriptionId);
      router.push(`/dashboard/pacientes/${patientId}/prescripciones`);
    } catch (error) {
      console.error("Failed to delete prescription:", error);
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
