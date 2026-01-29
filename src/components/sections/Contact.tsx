import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/shared/ContactForm";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="bg-gradient-to-b from-white to-sky-50/70 py-16 scroll-mt-24 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">{t("title")}</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("subtitle")}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-sky-100/70 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sky-600">
                  <MapPin className="h-5 w-5" />
                  <CardTitle className="text-base text-slate-900">Dirección</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">{t("address")}</CardContent>
            </Card>
            <Card className="border border-sky-100/70 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sky-600">
                  <Phone className="h-5 w-5" />
                  <CardTitle className="text-base text-slate-900">Teléfono</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">
                <a href="tel:+584247648994" className="font-semibold text-slate-900 hover:text-sky-700">
                  {t("phone")}
                </a>
                <p className="text-xs text-slate-500">Llamar ahora</p>
              </CardContent>
            </Card>
            <Card className="border border-sky-100/70 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sky-600">
                  <Clock className="h-5 w-5" />
                  <CardTitle className="text-base text-slate-900">Horario</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">{t("schedule")}</CardContent>
            </Card>
          </div>

          <Card className="border border-sky-100/70 bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-500" />
                <span>{t("address")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-sky-500" />
                <a href="tel:+584247648994" className="hover:text-slate-900">
                  {t("phone")}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-500" />
                <a href="mailto:contacto@drakristhy.com" className="hover:text-slate-900">
                  {t("email")}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-500" />
                <span>{t("schedule")}</span>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <iframe
              title={t("map_label")}
              className="h-64 w-full"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.39475797573!2d-72.2290!3d7.7700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e664561b8a56955%3A0x6d9b5568b71310e9!2sPueblo%20Nuevo%2C%20San%20Crist%C3%B3bal%2C%20T%C3%A1chira%2C%20Venezuela!5e0!3m2!1sen!2sve!4v1700000000001!5m2!1sen!2sve"
            />
          </div>
        </div>

        <Card className="border border-emerald-100/70 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
