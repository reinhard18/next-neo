import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  CustomerId, 
  NewCustomerParams,
  UpdateCustomerParams, 
  updateCustomerSchema,
  insertCustomerSchema, 
  customers,
  customerIdSchema 
} from "@/lib/db/schema/customers";

export const createCustomer = async (customer: NewCustomerParams) => {
  const newCustomer = insertCustomerSchema.parse(customer);
  try {
    const [c] =  await db.insert(customers).values(newCustomer).returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCustomer = async (id: CustomerId, customer: UpdateCustomerParams) => {
  const { id: customerId } = customerIdSchema.parse({ id });
  const newCustomer = updateCustomerSchema.parse(customer);
  try {
    const [c] =  await db
     .update(customers)
     .set({...newCustomer, updatedAt: new Date() })
     .where(eq(customers.id, customerId!))
     .returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCustomer = async (id: CustomerId) => {
  const { id: customerId } = customerIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(customers).where(eq(customers.id, customerId!))
    .returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

