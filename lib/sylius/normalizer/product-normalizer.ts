import {
  SyliusProduct,
  SyliusProductImage,
  SyliusProductOption,
  SyliusProductVariant
} from '../sylius-types/product-types';
import { Image, Product, ProductOption, ProductVariant } from '../types';
import { normalizePrice } from './utils-normalizer';

export const normalizeProduct = (product: SyliusProduct): Product => ({
  seo: {
    title: product.name ?? '',
    description: product.shortDescription ?? ''
  },
  variants: product.variants ? product.variants.map(normalizeProductVariant) : [],
  images: product.images ? product.images.map(normalizeProductImage) : [],
  id: product.id?.toString() ?? '',
  handle: product.slug ?? '',
  availableForSale: product.variants ? product.variants.some((variant) => variant.inStock) : false,
  title: product.name ?? '',
  description: product.shortDescription ?? '',
  descriptionHtml: product.description ?? '',
  options: product.options ? product.options.map(normalizeProductOption) : [],
  priceRange: normalizePriceRange(product),
  featuredImage:
    product.images && product.images.length > 0
      ? normalizeProductImage(product.images[0] as SyliusProductImage)
      : { url: '/placeholder.jpg', altText: 'Placeholder Image', width: 400, height: 400 },
  tags: [],
  updatedAt: product.updatedAt ? product.updatedAt.toString() : ''
});

const normalizeProductVariant = (variant: SyliusProductVariant): ProductVariant => ({
  id: variant.id?.toString() ?? '',
  code: variant.code ?? '',
  title: variant.name ?? '',
  availableForSale: variant.inStock ?? false,
  selectedOptions: variant.optionValues
    ? variant.optionValues.map((optionValue) => ({
        name: optionValue.option.name ?? '',
        value: optionValue.value ?? ''
      }))
    : [],
  price: normalizePrice(variant.price ?? 0)
});

const normalizeProductOption = (option: SyliusProductOption): ProductOption => ({
  id: option.id?.toString() ?? '',
  name: option.name ?? '',
  values: option.values ? option.values.map((optionValue) => optionValue.value ?? '') : []
});

export const normalizeProductImage = (image: SyliusProductImage): Image => {
  if (!image || !image.path) {
    console.warn('🚨 normalizeProductImage - Image is missing or undefined:', image);
    return {
      url: '/placeholder.jpg',
      altText: 'Placeholder Image',
      width: 400,
      height: 400
    };
  }

  // Suppression du slash final dans l'API backend pour éviter les doubles URLs
  const baseUrl = process.env.NEXT_PUBLIC_SYLIUS_BACKEND_API?.replace(/\/$/, '') ?? '';
  const imageUrl = image.path.startsWith('http')
    ? image.path
    : `${baseUrl}/${image.path.replace(/^\//, '')}`; // ✅ Syntaxe corrigée

  console.log('🖼️ Image URL:', imageUrl); // Debugging log

  return {
    url: imageUrl,
    altText: image.path ?? '',
    width: 400,
    height: 400
  };
};

const normalizePriceRange = (product: SyliusProduct) => {
  let minVariantPrice = Infinity;
  let maxVariantPrice = 0;

  if (product.variants && product.variants.length > 0) {
    for (const variant of product.variants) {
      if (variant.price !== undefined) {
        minVariantPrice = Math.min(minVariantPrice, variant.price);
        maxVariantPrice = Math.max(maxVariantPrice, variant.price);
      }
    }
  }

  if (minVariantPrice === Infinity) minVariantPrice = 0;

  return {
    minVariantPrice: normalizePrice(minVariantPrice),
    maxVariantPrice: normalizePrice(maxVariantPrice)
  };
};
