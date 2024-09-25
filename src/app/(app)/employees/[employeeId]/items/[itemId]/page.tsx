import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getItemById } from "@/lib/api/items/queries";
import { getEmployees } from "@/lib/api/employees/queries";import OptimisticItem from "@/app/(app)/items/[itemId]/OptimisticItem";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ItemPage({
  params,
}: {
  params: { itemId: string };
}) {

  return (
    <main className="overflow-auto">
      <Item id={params.itemId} />
    </main>
  );
}

const Item = async ({ id }: { id: string }) => {
  
  const { item } = await getItemById(id);
  const { employees } = await getEmployees();

  if (!item) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="items" />
        <OptimisticItem item={item} employees={employees}
        employeeId={item.employeeId} />
      </div>
    </Suspense>
  );
};
