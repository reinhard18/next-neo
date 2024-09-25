"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/employees/useOptimisticEmployees";
import { type Employee } from "@/lib/db/schema/employees";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import EmployeeForm from "@/components/employees/EmployeeForm";


export default function OptimisticEmployee({ 
  employee,
   
}: { 
  employee: Employee; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Employee) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticEmployee, setOptimisticEmployee] = useOptimistic(employee);
  const updateEmployee: TAddOptimistic = (input) =>
    setOptimisticEmployee({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <EmployeeForm
          employee={optimisticEmployee}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateEmployee}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticEmployee.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticEmployee.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticEmployee, null, 2)}
      </pre>
    </div>
  );
}
