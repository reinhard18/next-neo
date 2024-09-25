"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/customers/useOptimisticCustomers";
import { type Customer } from "@/lib/db/schema/customers";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CustomerForm from "@/components/customers/CustomerForm";
import { type Employee, type EmployeeId } from "@/lib/db/schema/employees";

export default function OptimisticCustomer({ 
  customer,
  employees,
  employeeId 
}: { 
  customer: Customer; 
  
  employees: Employee[];
  employeeId?: EmployeeId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Customer) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCustomer, setOptimisticCustomer] = useOptimistic(customer);
  const updateCustomer: TAddOptimistic = (input) =>
    setOptimisticCustomer({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CustomerForm
          customer={optimisticCustomer}
          employees={employees}
        employeeId={employeeId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCustomer}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCustomer.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCustomer.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCustomer, null, 2)}
      </pre>
    </div>
  );
}
