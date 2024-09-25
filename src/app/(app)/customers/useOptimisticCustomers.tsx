import { type Employee } from "@/lib/db/schema/employees";
import { type Customer, type CompleteCustomer } from "@/lib/db/schema/customers";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Customer>) => void;

export const useOptimisticCustomers = (
  customers: CompleteCustomer[],
  employees: Employee[]
) => {
  const [optimisticCustomers, addOptimisticCustomer] = useOptimistic(
    customers,
    (
      currentState: CompleteCustomer[],
      action: OptimisticAction<Customer>,
    ): CompleteCustomer[] => {
      const { data } = action;

      const optimisticEmployee = employees.find(
        (employee) => employee.id === data.employeeId,
      )!;

      const optimisticCustomer = {
        ...data,
        employee: optimisticEmployee,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticCustomer]
            : [...currentState, optimisticCustomer];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticCustomer } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticCustomer, optimisticCustomers };
};
