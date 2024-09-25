import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEmployeeByIdWithCustomersAndItems } from "@/lib/api/employees/queries";
import OptimisticEmployee from "./OptimisticEmployee";
import CustomerList from "@/components/customers/CustomerList";
import ItemList from "@/components/items/ItemList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function EmployeePage({
  params,
}: {
  params: { employeeId: string };
}) {

  return (
    <main className="overflow-auto">
      <Employee id={params.employeeId} />
    </main>
  );
}

const Employee = async ({ id }: { id: string }) => {
  
  const { employee, customers, items } = await getEmployeeByIdWithCustomersAndItems(id);
  

  if (!employee) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="employees" />
        <OptimisticEmployee employee={employee}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{employee.name}&apos;s Customers</h3>
        <CustomerList
          employees={[]}
          employeeId={employee.id}
          customers={customers}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{employee.name}&apos;s Items</h3>
        <ItemList
          employees={[]}
          employeeId={employee.id}
          items={items}
        />
      </div>
    </Suspense>
  );
};
