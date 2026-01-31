"use client";

import { useRouter } from "next/navigation";
import { deletePatient } from "@/server/actions/patient";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

interface DeletePatientButtonProps {
  patientId: string;
  patientName: string;
}

export function DeletePatientButton({ patientId, patientName }: DeletePatientButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deletePatient(patientId);
    router.push("/dashboard/pacientes");
    router.refresh();
  };

  return (
    <ConfirmDialog
      title="Desactivar paciente"
      description={`¿Estás seguro de que deseas desactivar a ${patientName}? El paciente no será eliminado permanentemente, pero no aparecerá en las listas.`}
      onConfirm={handleDelete}
      confirmText="Desactivar"
    >
      <Button variant="destructive">Desactivar</Button>
    </ConfirmDialog>
  );
}
