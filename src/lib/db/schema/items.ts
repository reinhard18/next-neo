import { sql } from "drizzle-orm";
import { varchar, integer, real, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { employees } from "./employees"
import { type getItems } from "@/lib/api/items/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const items = pgTable('items', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  qty: integer("qty").notNull(),
  price: real("price"),
  employeeId: varchar("employee_id", { length: 256 }).references(() => employees.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for items - used to validate API requests
const baseSchema = createSelectSchema(items).omit(timestamps)

export const insertItemSchema = createInsertSchema(items).omit(timestamps);
export const insertItemParams = baseSchema.extend({
  qty: z.coerce.number(),
  price: z.coerce.number(),
  employeeId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateItemSchema = baseSchema;
export const updateItemParams = baseSchema.extend({
  qty: z.coerce.number(),
  price: z.coerce.number(),
  employeeId: z.coerce.string().min(1)
})
export const itemIdSchema = baseSchema.pick({ id: true });

// Types for items - used to type API request params and within Components
export type Item = typeof items.$inferSelect;
export type NewItem = z.infer<typeof insertItemSchema>;
export type NewItemParams = z.infer<typeof insertItemParams>;
export type UpdateItemParams = z.infer<typeof updateItemParams>;
export type ItemId = z.infer<typeof itemIdSchema>["id"];
    
// this type infers the return from getItems() - meaning it will include any joins
export type CompleteItem = Awaited<ReturnType<typeof getItems>>["items"][number];

