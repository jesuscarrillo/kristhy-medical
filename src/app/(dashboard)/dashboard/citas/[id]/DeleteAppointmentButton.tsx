"use client";

import { useRouter } from "next/navigation";
import { deleteAppointment } from "@/server/actions/appointment";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

interface DeleteAppointmentButtonProps {
  appointmentId: string;
  patientName: string;
}

export function DeleteAppointmentButton({ appointmentId, patientName }: DeleteAppointmentButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteAppointment(appointmentId);
    router.push("/dashboard/citas");
    router.refresh();
  };

  return (
    <ConfirmDialog
      title="Cancelar cita"
      description={`¿Estás seguro de que deseas cancelar la cita de ${patientName}?`}
      onConfirm={handleDelete}
      confirmText="Cancelar cita"
    >
      <Button variant="destructive">Cancelar</Button>
    </ConfirmDialog>
  );
}
