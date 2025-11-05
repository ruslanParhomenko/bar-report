import { UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";

export function FormWrapper ({form, children,onSubmit}:{form:UseFormReturn<any>;children:React.ReactNode;onSubmit?:()=>void}) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit || (() => {}))}>
                {children}
            </form>
        </Form>
    )
}