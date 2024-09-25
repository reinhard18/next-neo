import { Suspense } from "react";

import Loading from "@/app/loading";
import EmployeeList from "@/components/employees/EmployeeList";
import { getEmployees } from "@/lib/api/employees/queries";


export const revalidate = 0;

export default async function EmployeesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Employees</h1>
        </div>
        <Employees />
      </div>
    </main>
  );
}

const Employees = async () => {
  
  const { employees } = await getEmployees();
  
  return (
    <Suspense fallback={<Loading />}>
      <EmployeeList employees={employees}  />
    </Suspense>
  );
};
