import { createFileRoute } from "@tanstack/react-router";
import { ClothingHomePage } from "./index";

export const Route = createFileRoute("/clothing")({
  head: () => ({
    meta: [
      { title: "Clothing — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Handwoven Banarasi and Maheshwari silks, premium cottons, handpainted suit sets and designer formals from LaMoksh Fabrics.",
      },
      { property: "og:title", content: "Clothing — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Handwoven silks and cotton suit sets with a contemporary drape.",
      },
      { property: "og:url", content: "/clothing" },
    ],
    links: [{ rel: "canonical", href: "/clothing" }],
  }),
  component: ClothingHomePage,
});
