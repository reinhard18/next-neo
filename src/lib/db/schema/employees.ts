import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getEmployees } from "@/lib/api/employees/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const employees = pgTable('employees', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for employees - used to validate API requests
const baseSchema = createSelectSchema(employees).omit(timestamps)

export const insertEmployeeSchema = createInsertSchema(employees).omit(timestamps);
export const insertEmployeeParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateEmployeeSchema = baseSchema;
export const updateEmployeeParams = baseSchema.extend({})
export const employeeIdSchema = baseSchema.pick({ id: true });

// Types for employees - used to type API request params and within Components
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = z.infer<typeof insertEmployeeSchema>;
export type NewEmployeeParams = z.infer<typeof insertEmployeeParams>;
export type UpdateEmployeeParams = z.infer<typeof updateEmployeeParams>;
export type EmployeeId = z.infer<typeof employeeIdSchema>["id"];
    
// this type infers the return from getEmployees() - meaning it will include any joins
export type CompleteEmployee = Awaited<ReturnType<typeof getEmployees>>["employees"][number];

