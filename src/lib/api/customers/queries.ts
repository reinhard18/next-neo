import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CustomerId, customerIdSchema, customers } from "@/lib/db/schema/customers";
import { employees } from "@/lib/db/schema/employees";

export const getCustomers = async () => {
  const rows = await db.select({ customer: customers, employee: employees }).from(customers).leftJoin(employees, eq(customers.employeeId, employees.id));
  const c = rows .map((r) => ({ ...r.customer, employee: r.employee})); 
  return { customers: c };
};

export const getCustomerById = async (id: CustomerId) => {
  const { id: customerId } = customerIdSchema.parse({ id });
  const [row] = await db.select({ customer: customers, employee: employees }).from(customers).where(eq(customers.id, customerId)).leftJoin(employees, eq(customers.employeeId, employees.id));
  if (row === undefined) return {};
  const c =  { ...row.customer, employee: row.employee } ;
  return { customer: c };
};


