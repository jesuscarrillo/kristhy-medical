import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <RecaptchaProvider>{children}</RecaptchaProvider>;
}
