import type { APIRoute } from "astro";
import { archiveWords } from "../data/words";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      latestEdition: archiveWords[0]?.date ?? null,
    }),
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
