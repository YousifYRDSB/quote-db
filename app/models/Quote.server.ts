import db from "../db.server";
import type { Quote } from '@prisma/client'
import exp from "constants";
import { emit } from "process";
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
  console.log(shopId)
  invariant(shopId, 'Shop ID is required');
  invariant(productId, 'Product ID is required');
  invariant(variantId, 'Variant ID is required');
  invariant(title, 'Title is required');
  invariant(email, 'Email is required');

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

// Update an existing quote
export async function updateQuote(id: string, data: Partial<Quote>) {
  return await db.quote.update({
    where: { id },
    data,
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


export async function deleteQuote(id: string) {
  return await db.quote.delete({ where: { id } });
}