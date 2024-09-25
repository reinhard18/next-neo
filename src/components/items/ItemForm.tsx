import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/items/useOptimisticItems";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Item, insertItemParams } from "@/lib/db/schema/items";
import {
  createItemAction,
  deleteItemAction,
  updateItemAction,
} from "@/lib/actions/items";
import { type Employee, type EmployeeId } from "@/lib/db/schema/employees";

const ItemForm = ({
  employees,
  employeeId,
  item,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  item?: Item | null;
  employees: Employee[];
  employeeId?: EmployeeId
  openModal?: (item?: Item) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Item>(insertItemParams);
  const editing = !!item?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("items");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Item },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Item ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const itemParsed = await insertItemParams.safeParseAsync({ employeeId, ...payload });
    if (!itemParsed.success) {
      setErrors(itemParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = itemParsed.data;
    const pendingItem: Item = {
      updatedAt: item?.updatedAt ?? new Date(),
      createdAt: item?.createdAt ?? new Date(),
      id: item?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingItem,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateItemAction({ ...values, id: item.id })
          : await createItemAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingItem 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={item?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.qty ? "text-destructive" : "",
          )}
        >
          Qty
        </Label>
        <Input
          type="text"
          name="qty"
          className={cn(errors?.qty ? "ring ring-destructive" : "")}
          defaultValue={item?.qty ?? ""}
        />
        {errors?.qty ? (
          <p className="text-xs text-destructive mt-2">{errors.qty[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.price ? "text-destructive" : "",
          )}
        >
          Price
        </Label>
        <Input
          type="text"
          name="price"
          className={cn(errors?.price ? "ring ring-destructive" : "")}
          defaultValue={item?.price ?? ""}
        />
        {errors?.price ? (
          <p className="text-xs text-destructive mt-2">{errors.price[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {employeeId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.employeeId ? "text-destructive" : "",
          )}
        >
          Employee
        </Label>
        <Select defaultValue={item?.employeeId} name="employeeId">
          <SelectTrigger
            className={cn(errors?.employeeId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a employee" />
          </SelectTrigger>
          <SelectContent>
          {employees?.map((employee) => (
            <SelectItem key={employee.id} value={employee.id.toString()}>
              {employee.id}{/* TODO: Replace with a field from the employee model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.employeeId ? (
          <p className="text-xs text-destructive mt-2">{errors.employeeId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: item });
              const error = await deleteItemAction(item.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: item,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default ItemForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
