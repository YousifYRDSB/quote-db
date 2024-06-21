import { LoaderFunction, json } from "@remix-run/node";
import { getQuotes } from "../models/Quote.server";
import { authenticate } from "~/shopify.server";


export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const { shop } = session;
    const shopId = shop;
    const quotes = await getQuotes(shopId);
    return json({
      quotes,
      shop,
    });
  };