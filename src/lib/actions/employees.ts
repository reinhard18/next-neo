"use server";

import { revalidatePath } from "next/cache";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "@/lib/api/employees/mutations";
import {
  EmployeeId,
  NewEmployeeParams,
  UpdateEmployeeParams,
  employeeIdSchema,
  insertEmployeeParams,
  updateEmployeeParams,
} from "@/lib/db/schema/employees";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateEmployees = () => revalidatePath("/employees");

export const createEmployeeAction = async (input: NewEmployeeParams) => {
  try {
    const payload = insertEmployeeParams.parse(input);
    await createEmployee(payload);
    revalidateEmployees();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateEmployeeAction = async (input: UpdateEmployeeParams) => {
  try {
    const payload = updateEmployeeParams.parse(input);
    await updateEmployee(payload.id, payload);
    revalidateEmployees();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteEmployeeAction = async (input: EmployeeId) => {
  try {
    const payload = employeeIdSchema.parse({ id: input });
    await deleteEmployee(payload.id);
    revalidateEmployees();
  } catch (e) {
    return handleErrors(e);
  }
};