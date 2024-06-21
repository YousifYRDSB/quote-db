import db from "../db.server";
import type { Quote } from '@prisma/client';
import invariant from 'tiny-invariant';

//class with static methods to interact with the database
class QuoteService {


  /**
   * Creates a quote.
   *
   * @param {Object} params - The parameters for creating the quote.
   * @param {string} params.shopId - The ID of the shop.
   * @param {string} params.productId - The ID of the product.
   * @param {string} params.variantId - The ID of the variant.
   * @param {string} params.title - The title of the quote.
   * @param {string} params.name - The name of the person the quote is for.
   * @param {string} params.email - The email of the person the quote is for.
   * @param {string} [params.image] - The image associated with the quote (optional).
   * @param {string} [params.metadata] - The metadata associated with the quote (optional).
   * @param {string} [params.message] - The message associated with the quote (optional).
   * @return {Promise<Quote>} The created quote.
   */
  public static async createQuote({
    shopId,
    productId,
    variantId,
    title,
    name,
    email,
    image,
    metadata,
    message,
  }: {
    shopId: string;
    productId: string;
    variantId: string;
    title: string;
    name: string;
    email: string;
    image?: string;
    metadata?: string;
    message?: string;
  }) {
    console.log(shopId);

    //validations using invariant
    invariant(shopId, 'Shop ID is required');
    invariant(productId, 'Product ID is required');
    invariant(variantId, 'Variant ID is required');
    invariant(title, 'Title is required');
    invariant(email, 'Email is required');

    //create the quote in the prisma/sql database
    return await db.quote.create({
      data: {
        shopId,
        productId,
        variantId,
        title,
        name,
        email,
        image,
        metadata: metadata ? JSON.stringify(metadata) : "",
        message: message ? message : "",
      },
    });
  }


  /**
   * Updates a quote in the database given an id and the data to update. (not used in project)
   *
   * @param {string} id - The ID of the quote to update.
   * @param {Partial<Quote>} data - The data to update the quote with.
   * @return {Promise<Quote>} The updated quote.
   */
  public static async updateQuote(id: string, data: Partial<Quote>) {
    return await db.quote.update({
      where: { id },
      data,
    });
  }

  /**
   * Validates the quote data to ensure that all required fields are present.
   *
   * @param {Object} data - The data to validate.
   * @param {string} [data.title] - The title of the quote.
   * @param {string} [data.productId] - The ID of the product.
   * @param {string} [data.variantId] - The ID of the variant.
   * @return {Object|null} An object containing any validation errors, or `null` if the data is valid.
   */
  public static validateQuote(data: { title?: string; productId?: string; variantId?: string; }) {
    const errors: Record<string, string> = {};

    if (!data.title) {
      errors.title = 'Title is required';
    }

    if (!data.productId) {
      errors.productId = 'Product is required';
    }

    if (!data.variantId) {
      errors.variantId = 'Variant is required';
    }

    return Object.keys(errors).length ? errors : null;
  }


  /**
   * Retrieves a quote by its ID.
   *
   * @param {string} id - The ID of the quote to retrieve.
   * @return {Promise<Quote|null>} The quote with the given ID, or `null` if not found.
   */
  public static async getQuote(id: string) {
    const quote = await db.quote.findUnique({ where: { id } });
    return quote || null;
  }


  /**
   * Retrieves all quotes for a given shop.
   *
   * @param {string} shopId - The ID of the shop.
   * @return {Promise<Quote[]>} An array of quotes for the given shop.
   */
  public static async getQuotes(shopId: string) {
    return await db.quote.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });
  }

/**
   * Updates a quote in the database given an id and the data to update.
   *
   * @param {string} id - The ID of the quote to update.
   * @param {Partial<Quote>} data - The data to update the quote with.
   * @return {Promise<Quote>} The updated quote.
   */
  public static async deleteQuote(id: string) {
    return await db.quote.delete({ where: { id } });
  }
}

export default QuoteService;

//exports the static methods to be directly imported in the other files
export const { createQuote, getQuotes, validateQuote, deleteQuote } = QuoteService;
