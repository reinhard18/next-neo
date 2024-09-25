import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCustomerById } from "@/lib/api/customers/queries";
import { getEmployees } from "@/lib/api/employees/queries";import OptimisticCustomer from "@/app/(app)/customers/[customerId]/OptimisticCustomer";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CustomerPage({
  params,
}: {
  params: { customerId: string };
}) {

  return (
    <main className="overflow-auto">
      <Customer id={params.customerId} />
    </main>
  );
}

const Customer = async ({ id }: { id: string }) => {
  
  const { customer } = await getCustomerById(id);
  const { employees } = await getEmployees();

  if (!customer) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="customers" />
        <OptimisticCustomer customer={customer} employees={employees}
        employeeId={customer.employeeId} />
      </div>
    </Suspense>
  );
};
