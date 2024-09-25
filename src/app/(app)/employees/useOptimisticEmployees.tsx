
import { type Employee, type CompleteEmployee } from "@/lib/db/schema/employees";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Employee>) => void;

export const useOptimisticEmployees = (
  employees: CompleteEmployee[],
  
) => {
  const [optimisticEmployees, addOptimisticEmployee] = useOptimistic(
    employees,
    (
      currentState: CompleteEmployee[],
      action: OptimisticAction<Employee>,
    ): CompleteEmployee[] => {
      const { data } = action;

      

      const optimisticEmployee = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticEmployee]
            : [...currentState, optimisticEmployee];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticEmployee } : item,
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

  return { addOptimisticEmployee, optimisticEmployees };
};
