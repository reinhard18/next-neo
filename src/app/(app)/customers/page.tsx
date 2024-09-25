import { Suspense } from "react";

import Loading from "@/app/loading";
import CustomerList from "@/components/customers/CustomerList";
import { getCustomers } from "@/lib/api/customers/queries";
import { getEmployees } from "@/lib/api/employees/queries";

export const revalidate = 0;

export default async function CustomersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Customers</h1>
        </div>
        <Customers />
      </div>
    </main>
  );
}

const Customers = async () => {
  
  const { customers } = await getCustomers();
  const { employees } = await getEmployees();
  return (
    <Suspense fallback={<Loading />}>
      <CustomerList customers={customers} employees={employees} />
    </Suspense>
  );
};
