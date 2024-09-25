import { Suspense } from "react";

import Loading from "@/app/loading";
import ItemList from "@/components/items/ItemList";
import { getItems } from "@/lib/api/items/queries";
import { getEmployees } from "@/lib/api/employees/queries";

export const revalidate = 0;

export default async function ItemsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Items</h1>
        </div>
        <Items />
      </div>
    </main>
  );
}

const Items = async () => {
  
  const { items } = await getItems();
  const { employees } = await getEmployees();
  return (
    <Suspense fallback={<Loading />}>
      <ItemList items={items} employees={employees} />
    </Suspense>
  );
};
