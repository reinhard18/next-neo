import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { employees } from "./employees"
import { type getCustomers } from "@/lib/api/customers/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const customers = pgTable('customers', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }),
  address: varchar("address", { length: 256 }),
  employeeId: varchar("employee_id", { length: 256 }).references(() => employees.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for customers - used to validate API requests
const baseSchema = createSelectSchema(customers).omit(timestamps)

export const insertCustomerSchema = createInsertSchema(customers).omit(timestamps);
export const insertCustomerParams = baseSchema.extend({
  employeeId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateCustomerSchema = baseSchema;
export const updateCustomerParams = baseSchema.extend({
  employeeId: z.coerce.string().min(1)
})
export const customerIdSchema = baseSchema.pick({ id: true });

// Types for customers - used to type API request params and within Components
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
export type NewCustomerParams = z.infer<typeof insertCustomerParams>;
export type UpdateCustomerParams = z.infer<typeof updateCustomerParams>;
export type CustomerId = z.infer<typeof customerIdSchema>["id"];
    
// this type infers the return from getCustomers() - meaning it will include any joins
export type CompleteCustomer = Awaited<ReturnType<typeof getCustomers>>["customers"][number];

