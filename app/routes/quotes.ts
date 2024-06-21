import { LoaderFunction, json } from "@remix-run/node";
import { getQuotes } from "../models/Quote.server";
import { authenticate } from "~/shopify.server";


/**
 * Loader function to fetch quotes from the database.
 * retirms the quotes and the shop id as a server endpoint when called from a GET request
 *
 * @param {LoaderFunctionArgs} args 
 * @param {Request} args.request
 * @return {Promise<{quotes: Quote[], shop: string}>} 
 */
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