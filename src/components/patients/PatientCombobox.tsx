"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string;
}

interface PatientComboboxProps {
  patients: Patient[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PatientCombobox({
  patients,
  value,
  onChange,
  disabled,
}: PatientComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedPatient = patients.find((p) => p.id === value);

  const filteredPatients = useMemo(() => {
    if (!search) return patients;
    const searchLower = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        p.cedula.toLowerCase().includes(searchLower)
    );
  }, [patients, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedPatient ? (
            <span>
              {selectedPatient.firstName} {selectedPatient.lastName}{" "}
              <span className="text-slate-500">({selectedPatient.cedula})</span>
            </span>
          ) : (
            <span className="text-slate-500">Buscar paciente...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"
              placeholder="Buscar por nombre, apellido o cédula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandList>
            <CommandEmpty>No se encontraron pacientes.</CommandEmpty>
            <CommandGroup>
              {filteredPatients.slice(0, 50).map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={patient.id}
                  onSelect={() => {
                    onChange(patient.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === patient.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>
                      {patient.firstName} {patient.lastName}
                    </span>
                    <span className="text-xs text-slate-500">
                      Cédula: {patient.cedula}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
