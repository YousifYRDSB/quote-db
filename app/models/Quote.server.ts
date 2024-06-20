import db from "../db.server";
import type { Quote } from '@prisma/client'
import invariant from 'tiny-invariant';

// Create or update settings
export async function updateSettings(shopId: string, adminEmail: string) {
  const existingSettings = await db.settings.findUnique({
    where: { shopId },
  });

  if (existingSettings) {
    return await db.settings.update({
      where: { shopId },
      data: { adminEmail },
    });
  } else {
    return await db.settings.create({
      data: { shopId, adminEmail },
    });
  }
}

// Create a new quote
export async function createQuote({
  shopId,
  productId,
  variantId,
  title,
  image,
  metadata,
  message,
}: {
  shopId: string;
  productId: string;
  variantId: string;
  title: string;
  image?: string;
  metadata?: string;
  message?: string;
}) {
  invariant(shopId, 'Shop ID is required');
  invariant(productId, 'Product ID is required');
  invariant(variantId, 'Variant ID is required');
  invariant(title, 'Title is required');

  return await db.quote.create({
    data: {
      shopId,
      productId,
      variantId,
      title,
      image,
      metadata: metadata ? JSON.stringify(metadata) : "",
      message: message ? message : "",
      status: 'pending',
    },
  });
}

// Update an existing quote
export async function updateQuote(id: string, data: Partial<Quote>) {
  return await db.quote.update({
    where: { id },
    data,
  });
}

// Update quote status
export async function updateQuoteStatus(id: string, status: string) {
  invariant(status, 'Status is required');

  return await db.quote.update({
    where: { id },
    data: { status },
  });
}

// Validate quote data
export function validateQuote(data: {
  title?: string;
  productId?: string;
  variantId?: string;
}) {
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

// Fetch a quote by ID
export async function getQuote(id: string) {
  const quote = await db.quote.findUnique({ where: { id } });
  return quote || null;
}

// Fetch all quotes for a specific shop
export async function getQuotes(shopId: string) {
  return await db.quote.findMany({
    where: { shopId },
    orderBy: { createdAt: 'desc' },
  });
}
