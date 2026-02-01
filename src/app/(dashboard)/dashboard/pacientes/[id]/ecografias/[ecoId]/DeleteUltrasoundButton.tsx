"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUltrasound } from "@/server/actions/ultrasound";
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

type DeleteUltrasoundButtonProps = {
  ultrasoundId: string;
  patientId: string;
};

export function DeleteUltrasoundButton({
  ultrasoundId,
  patientId,
}: DeleteUltrasoundButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUltrasound(ultrasoundId);
      router.push(`/dashboard/pacientes/${patientId}/ecografias`);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error al eliminar la ecografía");
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
          <AlertDialogTitle>¿Eliminar ecografía?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La ecografía y sus imágenes
            asociadas serán eliminadas permanentemente.
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
