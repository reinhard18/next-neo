import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ItemId, itemIdSchema, items } from "@/lib/db/schema/items";
import { employees } from "@/lib/db/schema/employees";

export const getItems = async () => {
  const rows = await db.select({ item: items, employee: employees }).from(items).leftJoin(employees, eq(items.employeeId, employees.id));
  const i = rows .map((r) => ({ ...r.item, employee: r.employee})); 
  return { items: i };
};

export const getItemById = async (id: ItemId) => {
  const { id: itemId } = itemIdSchema.parse({ id });
  const [row] = await db.select({ item: items, employee: employees }).from(items).where(eq(items.id, itemId)).leftJoin(employees, eq(items.employeeId, employees.id));
  if (row === undefined) return {};
  const i =  { ...row.item, employee: row.employee } ;
  return { item: i };
};


