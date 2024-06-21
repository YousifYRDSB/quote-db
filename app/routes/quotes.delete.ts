import { ActionFunction, redirect } from "@remix-run/node";
import { deleteQuote } from "../models/Quote.server";

export const action: ActionFunction = async ({ request }) => {
  const { id } = await request.json();

  await deleteQuote(id);
  console.log("DELETED")
  return redirect("/app/quotes");
};
