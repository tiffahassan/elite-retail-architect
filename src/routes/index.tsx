import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ناتشورال آند إيليت — لوحة التحكم" },
      {
        name: "description",
        content:
          "ناتشورال آند إيليت — نظام نقاط بيع وإدارة مخزون احترافي لمستحضرات التجميل والمستلزمات الطبية والمكملات الغذائية.",
      },
      { property: "og:title", content: "ناتشورال آند إيليت — لوحة التحكم" },
      {
        property: "og:description",
        content: "نقي بالطبيعة. متميّز بالاختيار. نظام نقاط بيع وإدارة مخزون فاخر.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
