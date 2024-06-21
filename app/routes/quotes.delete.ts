import { ActionFunction, redirect } from "@remix-run/node";
import { deleteQuote } from "../models/Quote.server";

//Server component, this route acts as an endpoint that deletes  a quote when pinged with a POST request, and the relevant data.
export const action: ActionFunction = async ({ request }) => {
  const { id } = await request.json();

  await deleteQuote(id);
  console.log("DELETED")
  return redirect("/app/quotes");
};
