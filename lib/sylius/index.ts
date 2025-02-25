import { REST_METHODS, SYLIUS_API_ENDPOINT } from 'lib/constants';
import { normalizeCart } from './normalizer/cart-normalizer';
import { normalizeCollection } from './normalizer/collection-normalizer';
import { normalizeProduct } from './normalizer/product-normalizer';
import { SyliusProduct, SyliusTaxon } from './sylius-types/product-types';
import {
  AddToCartPayload,
  Cart,
  Collection,
  GetCollectionProductsPayload,
  GetProductsPayload,
  UpdateCartPayload
} from './types';

const DOMAIN = process.env.NEXT_PUBLIC_SYLIUS_BACKEND_API?.replace(/\/$/, ''); // Supprime le / final s'il existe
const ENDPOINT = `${DOMAIN}${SYLIUS_API_ENDPOINT}`.replace(/\/$/, ''); // Supprime le / final s'il existe
console.log('🌍 Sylius API Endpoint:', ENDPOINT);

// Fetch
export default async function syliusRequest(
  method: string,
  path = '',
  payload?: Record<string, unknown> | undefined,
  contentType?: string
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': contentType ?? 'application/json',
      Accept: 'application/json'
    }
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  try {
    const result = await fetch(`${ENDPOINT}${path}`, options);
    const body = await result.json();

    console.log(`📢 Fetching from Sylius: ${method} ${ENDPOINT}${path}`);
    console.log('✅ API Raw Response:', body);

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    console.error('❌ API Request Failed:', e);
    throw { error: e };
  }
}

// Pages
export const getPages = () => [];
export const getPage = () => {};

// Products
export const getProducts = async (payload: GetProductsPayload) => {
  const url = new URL(`${ENDPOINT}/products`);
  if (payload.query) {
    url.searchParams.set('translations.name', payload.query);
  }
  const orderBy = payload.reverse ? 'desc' : 'asc';

  if (payload.sortKey) {
    switch (payload.sortKey) {
      case 'CREATED_AT':
        url.searchParams.set('order[createdAt]', orderBy);
        break;
      case 'PRICE':
        url.searchParams.set('order[price]', orderBy);
        break;
      default:
        break;
    }
  }

  const data = await syliusRequest(REST_METHODS.GET, '/products' + url.search);
  console.log('📌 API Response for Products:', data.body);

  if (!Array.isArray(data.body)) {
    console.error('🚨 Products response is not an array:', data.body);
    return [];
  }

  return data.body.map((syliusProduct: SyliusProduct) => normalizeProduct(syliusProduct));
};

export const getProduct = async (slug: string) => {
  const data = await syliusRequest(REST_METHODS.GET, '/products-by-slug/' + slug);
  console.log('📌 API Response for Product:', data.body);
  return normalizeProduct(data.body);
};

// Collections
export const getCollections = async (): Promise<Collection[]> => {
  const data = await syliusRequest(REST_METHODS.GET, '/taxons');

  console.log('📌 API Response for Taxons:', data.body);

  if (!Array.isArray(data.body)) {
    console.error("🚨 syliusTaxons n'est pas un tableau, API response:", data.body);
    return [];
  }

  return data.body.map((syliusTaxon: SyliusTaxon) => normalizeCollection(syliusTaxon));
};

export const getCollection = async (taxonCode: string) => {
  const data = await syliusRequest(REST_METHODS.GET, '/taxons/' + taxonCode);
  console.log('📌 API Response for Collection:', data.body);
  return normalizeCollection(data.body);
};

export const getCollectionProducts = async (payload: GetCollectionProductsPayload) => {
  const url = new URL(`${ENDPOINT}/products`);
  if (payload.collection) {
    url.searchParams.set('productTaxons.taxon.code', payload.collection);
  }
  const orderBy = payload.reverse ? 'desc' : 'asc';

  if (payload.sortKey) {
    switch (payload.sortKey) {
      case 'CREATED_AT':
        url.searchParams.set('order[createdAt]', orderBy);
        break;
      case 'PRICE':
        url.searchParams.set('order[price]', orderBy);
        break;
      default:
        break;
    }
  }

  const data = await syliusRequest(REST_METHODS.GET, '/products' + url.search);
  console.log('📌 API Response for Collection Products:', data.body);

  if (!Array.isArray(data.body)) {
    console.error("🚨 syliusProducts n'est pas un tableau, API response:", data.body);
    return [];
  }

  return data.body.map((syliusProduct: SyliusProduct) => normalizeProduct(syliusProduct));
};

// Cart
export const createCart = async (): Promise<Cart> => {
  const data = await syliusRequest(REST_METHODS.POST, '/orders', { localeCode: 'fr_FR' });
  return normalizeCart(data.body);
};

export const getCart = async (cartId: string): Promise<Cart> => {
  const data = await syliusRequest(REST_METHODS.GET, `/orders/${cartId}`);
  return normalizeCart(data.body);
};

export const addToCart = async (cartId: string | undefined, payload: AddToCartPayload[]) => {
  await syliusRequest(REST_METHODS.POST, `/orders/${cartId}/items`, {
    productVariant: payload[0]?.merchandiseId,
    quantity: payload[0]?.quantity
  });
};

export const removeFromCart = async (cartId: string, itemIds: string[]) => {
  await syliusRequest(REST_METHODS.DELETE, `/orders/${cartId}/items/${itemIds[0]}`);
};

export const updateCart = async (cartId: string, payload: UpdateCartPayload[]) => {
  await syliusRequest(
    REST_METHODS.PATCH,
    `/orders/${cartId}/items/${payload[0]?.id}`,
    {
      quantity: payload[0]?.quantity
    },
    'application/merge-patch+json'
  );
};

// Site
export const getMenu = async () => {
  const collections = await getCollections();
  console.log('📌 Collections dans getMenu:', collections);

  return [
    { title: 'All', path: '/search' },
    ...collections.slice(0, 2).map(({ title, path }) => ({ title, path }))
  ];
};
