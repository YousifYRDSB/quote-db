import { json, ActionFunction } from "@remix-run/node";
import { createQuote } from "../models/Quote.server";

//Server component, this route acts as an endpoint that creates a quote when pinged with a POST request, and the relevant data.
export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const { name, email, message, productId, variantId, title, image, shopId } = await request.json();
    console.log({ name, email, message, productId, variantId, title, shopId, image })

    // Validate the data if necessary
    // const errors = validateQuote({ name, email, message, productId, variantId, title, shopId });
    // if (errors) return json({ errors }, { status: 422 });

    await createQuote({shopId, productId, variantId, title, name, email, image, message });

    return json({ success: true });
  }

  return json({ error: "Invalid Content-Type" }, { status: 400 });
};
