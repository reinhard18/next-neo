import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type EmployeeId, employeeIdSchema, employees } from "@/lib/db/schema/employees";
import { customers, type CompleteCustomer } from "@/lib/db/schema/customers";
import { items, type CompleteItem } from "@/lib/db/schema/items";

export const getEmployees = async () => {
  const rows = await db.select().from(employees);
  const e = rows
  return { employees: e };
};

export const getEmployeeById = async (id: EmployeeId) => {
  const { id: employeeId } = employeeIdSchema.parse({ id });
  const [row] = await db.select().from(employees).where(eq(employees.id, employeeId));
  if (row === undefined) return {};
  const e = row;
  return { employee: e };
};

export const getEmployeeByIdWithCustomersAndItems = async (id: EmployeeId) => {
  const { id: employeeId } = employeeIdSchema.parse({ id });
  const rows = await db.select({ employee: employees, customer: customers, item: items }).from(employees).where(eq(employees.id, employeeId)).leftJoin(customers, eq(employees.id, customers.employeeId)).leftJoin(items, eq(employees.id, items.employeeId));
  if (rows.length === 0) return {};
  const e = rows[0].employee;
  const ec = rows.filter((r) => r.customer !== null).map((c) => c.customer) as CompleteCustomer[];
  const ei = rows.filter((r) => r.item !== null).map((i) => i.item) as CompleteItem[];

  return { employee: e, customers: ec, items: ei };
};

