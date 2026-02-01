"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCertificate } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteCertificateButtonProps = {
  certificateId: string;
  patientId: string;
};

export function DeleteCertificateButton({
  certificateId,
  patientId,
}: DeleteCertificateButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCertificate(certificateId);
      router.push(`/dashboard/pacientes/${patientId}/certificados`);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error al eliminar el certificado");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isDeleting}>
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar certificado?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El certificado será eliminado
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
