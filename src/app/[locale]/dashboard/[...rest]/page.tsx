import { redirect } from "next/navigation";

type LocaleDashboardCatchAllProps = {
  params: {
    rest?: string[];
  };
};

export default function LocaleDashboardCatchAll({
  params,
}: LocaleDashboardCatchAllProps) {
  const path = params.rest?.join("/") ?? "";
  redirect(`/dashboard/${path}`);
}
