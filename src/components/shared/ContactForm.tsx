"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { generateWhatsAppLink, openWhatsApp } from "@/lib/utils/whatsapp";
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
import { Mail, Phone, User, MessageSquare, MessageCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type TextFieldName = "name" | "email" | "phone";

// Extraído como componente para evitar inline render function (react-doctor)
function TextFieldInput({
  name,
  icon,
  placeholder,
  type = "text",
  hasError,
  isTouched,
  field,
}: {
  name: TextFieldName;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  hasError: boolean;
  isTouched: boolean;
  field: { value: string; onChange: React.ChangeEventHandler<HTMLInputElement>; onBlur: () => void; name: TextFieldName };
}) {
  const statusClass =
    hasError && isTouched
      ? "border-red-400 focus-visible:ring-red-300"
      : !hasError && isTouched
        ? "border-emerald-400 focus-visible:ring-emerald-300"
        : "";
  const controlId = `contact-${name}-field`;
  const autoComplete =
    name === "name" ? "name" : name === "email" ? "email" : name === "phone" ? "tel" : "off";
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          {icon}
        </span>
        <Input
          type={type}
          placeholder={placeholder}
          className={`pl-10 ${statusClass}`}
          id={controlId}
          autoComplete={autoComplete}
          {...field}
        />
      </div>
      <FormMessage />
    </div>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const getFieldId = (name: string) => `contact-${name}-field`;
  const statusClass = (name: keyof ContactFormValues) => {
    const hasError = !!form.formState.errors[name];
    const touched = !!form.formState.touchedFields[name];
    if (hasError && touched) return "border-red-400 focus-visible:ring-red-300";
    if (!hasError && touched) return "border-emerald-400 focus-visible:ring-emerald-300";
    return "";
  };
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
      // Generate WhatsApp link with formatted message
      const whatsappUrl = generateWhatsAppLink(values);

      // Open WhatsApp in new tab
      openWhatsApp(whatsappUrl);

      // Show success message
      setStatus("success");
      toast.success(t("toast.success"), {
        description: t("toast.whatsapp_opened") ?? "Te redirigimos a WhatsApp para enviar tu mensaje.",
      });

      // Reset form (keep user data, clear message and privacy checkbox)
      form.reset({ ...form.getValues(), message: "", privacy: false });
    } catch (error) {
      setStatus("error");
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("toast.error_detail") ?? "Por favor intenta nuevamente o llámanos.";

      toast.error(t("toast.error"), {
        description: errorMessage,
      });
    }
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
                <TextFieldInput
                  name="name"
                  field={field}
                  icon={<User className="h-4 w-4" />}
                  placeholder="María González"
                  type="text"
                  hasError={!!form.formState.errors.name}
                  isTouched={!!form.formState.touchedFields.name}
                />
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
                  <TextFieldInput
                    name="email"
                    field={field}
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="maria@email.com"
                    type="email"
                    hasError={!!form.formState.errors.email}
                    isTouched={!!form.formState.touchedFields.email}
                  />
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
                  <TextFieldInput
                    name="phone"
                    field={field}
                    icon={<Phone className="h-4 w-4" />}
                    placeholder="+58 412-073-5223"
                    type="text"
                    hasError={!!form.formState.errors.phone}
                    isTouched={!!form.formState.touchedFields.phone}
                  />
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
                  <span className="pointer-events-none absolute left-3 top-3 text-slate-400 dark:text-slate-500">
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
                    <Link href="/privacidad" className="text-sky-700 dark:text-sky-400 underline">
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
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{t("toast.success")}</p>
        )}
        {status === "error" && (
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{t("toast.error")}</p>
        )}

        <Button
          type="submit"
          className="group w-full gap-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-[0_0_20px_-5px_rgba(13,148,136,0.4)] transition-all duration-300 hover:shadow-[0_0_25px_-5px_rgba(13,148,136,0.6)] hover:-translate-y-0.5 sm:w-auto"
          disabled={form.formState.isSubmitting}
        >
          <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
          {t("form.submit_whatsapp") ?? "Enviar por WhatsApp"}
        </Button>
      </form>
    </Form>
  );
}
