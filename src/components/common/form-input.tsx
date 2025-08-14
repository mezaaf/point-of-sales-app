import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  description,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  description?: string;
}) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field: { ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea placeholder={placeholder} {...rest} />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                {...rest}
                autoComplete={autoComplete}
                onWheel={(e) => e.currentTarget.blur()}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
          <FormDescription>{description}</FormDescription>
        </FormItem>
      )}
    />
  );
}
