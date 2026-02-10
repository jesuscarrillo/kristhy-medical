"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Phone, User, Loader2, Send, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const getFieldId = (name: string) => `contact-${name}-field`;
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "prenatal",
      message: "",
      privacy: false,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        toast.success(t("toast.success"), {
          description: data.meta?.message ?? t("toast.success_detail") ?? "Te contactaremos pronto. Revisa tu email.",
        });
        form.reset({ ...form.getValues(), message: "", privacy: false });
        return;
      }

      // Handle error response with new structure
      setStatus("error");
      toast.error(t("toast.error"), {
        description: data.message ?? t("toast.error_detail") ?? "Por favor intenta nuevamente o llámanos.",
      });
    } catch (error) {
      setStatus("error");
      toast.error(t("toast.error"), {
        description: t("toast.error_detail") ?? "Por favor intenta nuevamente o llámanos.",
      });
    }
  };

  const statusClass = (name: keyof ContactFormValues) => {
    const hasError = !!form.formState.errors[name];
    const touched = form.formState.touchedFields[name];
    if (hasError && touched) return "border-red-400 focus-visible:ring-red-300";
    if (!hasError && touched) return "border-emerald-400 focus-visible:ring-emerald-300";
    return "";
  };

  type TextFieldName = "name" | "email" | "phone";

  const renderInput = <T extends TextFieldName>(
    field: ControllerRenderProps<ContactFormValues, T>,
    icon: React.ReactNode,
    placeholder: string,
    type = "text",
  ) => {
    const controlId = getFieldId(field.name);
    const autoComplete =
      field.name === "name" ? "name" : field.name === "email" ? "email" : field.name === "phone" ? "tel" : "off";
    return (
      <div className="space-y-1.5">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
          <Input
            type={type}
            placeholder={placeholder}
            className={`pl-10 ${statusClass(field.name)}`}
            id={controlId}
            autoComplete={autoComplete}
            {...field}
          />
        </div>
        <FormMessage />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem id={getFieldId("name")}>
              <FormLabel htmlFor={getFieldId("name")}>{t("form.name")}</FormLabel>
              <FormControl>
                {renderInput(field, <User className="h-4 w-4" />, "María González", "text")}
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem id={getFieldId("email")}>
                <FormLabel htmlFor={getFieldId("email")}>{t("form.email")}</FormLabel>
                <FormControl>
                  {renderInput(field, <Mail className="h-4 w-4" />, "maria@email.com", "email")}
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem id={getFieldId("phone")}>
                <FormLabel htmlFor={getFieldId("phone")}>{t("form.phone")}</FormLabel>
                <FormControl>
                  {renderInput(field, <Phone className="h-4 w-4" />, "+58 412-073-5223", "text")}
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
            <FormItem id={getFieldId("reason")}>
              <FormLabel htmlFor={getFieldId("reason")}>{t("form.reason")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    id={getFieldId("reason")}
                    className={statusClass("reason")}
                  >
                    <SelectValue placeholder={t("form.reason")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="prenatal">{t("form.reasons.prenatal")}</SelectItem>
                  <SelectItem value="highRisk">{t("form.reasons.highRisk")}</SelectItem>
                  <SelectItem value="gynecology">{t("form.reasons.gynecology")}</SelectItem>
                  <SelectItem value="surgery">{t("form.reasons.surgery")}</SelectItem>
                  <SelectItem value="ultrasound">{t("form.reasons.ultrasound")}</SelectItem>
                  <SelectItem value="cervical">{t("form.reasons.cervical")}</SelectItem>
                  <SelectItem value="other">{t("form.reasons.other")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem id={getFieldId("message")}>
              <FormLabel htmlFor={getFieldId("message")}>{t("form.message")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-3 text-slate-400">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <Textarea
                    rows={4}
                    placeholder={t("form.messagePlaceholder") ?? "Cuéntame cómo puedo ayudarte..."}
                    className={`pl-10 ${statusClass("message")}`}
                    id={getFieldId("message")}
                    autoComplete="off"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 rounded-lg border border-dashed border-border px-3 py-2">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    id={getFieldId("privacy")}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    name={field.name}
                  />
                </FormControl>
                <div className="space-y-1 leading-none text-sm">
                  <FormLabel htmlFor={getFieldId("privacy")} className="flex flex-col gap-1">
                    {t("form.privacy")}
                    <Link href="/privacidad" className="text-sky-600 underline">
                      {t("form.privacy_link") ?? "Política de Privacidad"}
                    </Link>
                  </FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "success" && (
          <p className="text-sm font-semibold text-emerald-600">{t("toast.success")}</p>
        )}
        {status === "error" && (
          <p className="text-sm font-semibold text-red-600">{t("toast.error")}</p>
        )}

        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("form.sending") ?? "Enviando..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {t("form.submit")}
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
