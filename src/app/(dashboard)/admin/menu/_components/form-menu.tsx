import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AVAILABILITY_LIST, CATEGORY_LIST } from "@/constants/menu-constant";
import { Preview } from "@/types/general";
import { Loader } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormMenu<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "create" | "update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent className="max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle className="capitalize">{type} Menu</DialogTitle>
          <DialogDescription>
            {type === "create" ? "Add a new menu" : "Make changes menu here"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Name"
              placeholder="Insert name here"
            />
            <FormInput
              form={form}
              name={"description" as Path<T>}
              label="Description"
              placeholder="Insert description here"
              type="textarea"
            />
            <FormSelect
              form={form}
              name={"category" as Path<T>}
              label="Category"
              selectItem={CATEGORY_LIST}
            />
            <FormInput
              form={form}
              name={"price" as Path<T>}
              label="Price"
              placeholder="Insert price here"
              type="number"
            />
            <FormInput
              form={form}
              name={"discount" as Path<T>}
              label="Discount"
              placeholder="Insert discount here"
              type="number"
            />
            <FormImage
              form={form}
              name={"image_url" as Path<T>}
              label="Image"
              preview={preview}
              setPreview={setPreview}
            />
            <FormSelect
              form={form}
              name={"is_available" as Path<T>}
              label="Availability"
              selectItem={AVAILABILITY_LIST}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button disabled={isLoading} type="submit" className="capitalize">
              {isLoading ? <Loader className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
