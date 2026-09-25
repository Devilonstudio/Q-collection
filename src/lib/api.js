import { supabase } from "./supabase";
import imageCompression from "browser-image-compression"; 


const BUCKET = "site-images";

// Helper to compress and convert any image file to WebP
async function compressToWebP(file, maxWidthOrHeight = 1600, maxSizeMB = 0.6) {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const compressedBlob = await imageCompression(file, options);
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return new File([compressedBlob], `${baseName}.webp`, { type: "image/webp" });
}

function assertReady() {
  if (!supabase) {
    throw new Error(
      "Supabase isn't configured yet. Copy .env.example to .env.local and fill in your project's URL and anon key."
    );
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories() {
  assertReady();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getCategory(slug) {
  assertReady();
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryById(id) {
  assertReady();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

// Categories plus each one's first available product image, for the
// homepage grid — avoids the page having to cross-reference two lists itself.
export async function getCategoriesWithCover() {
  assertReady();
  const categories = await getCategories();
  const { data: images, error } = await supabase
    .from("products")
    .select("category_id, sort_order, images:product_images(url, sort_order)")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  const coverByCategory = {};
  for (const product of images || []) {
    if (coverByCategory[product.category_id]) continue;
    const sorted = [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order);
    if (sorted[0]) coverByCategory[product.category_id] = sorted[0].url;
  }

  return categories.map((c) => ({ ...c, cover: coverByCategory[c.id] || null }));
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(fields) {
  assertReady();
  const { data, error } = await supabase.from("categories").insert(fields).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, patch) {
  assertReady();
  const { data, error } = await supabase.from("categories").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  assertReady();
  // Clean up storage files for every image on every product in this category
  // first — deleting the category row cascades the DB rows, but Storage
  // objects are separate and won't be removed automatically.
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", id);
  if (prodErr) throw prodErr;

  for (const product of products || []) {
    await deleteAllProductImages(product.id);
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCT_SELECT = "*, category:categories(id, slug, name), images:product_images(*)";

function sortImages(product) {
  if (product?.images) {
    product.images = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  }
  return product;
}

export async function getProducts() {
  assertReady();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(sortImages);
}

export async function getProductsByCategory(slug) {
  assertReady();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories!inner(id, slug, name), images:product_images(*)")
    .eq("category.slug", slug)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(sortImages);
}

export async function getProduct(id) {
  assertReady();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? sortImages(data) : null;
}

export async function getFeaturedProducts(limit = 8) {
  assertReady();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data || []).map(sortImages);
}

export async function getRelatedProducts(product, limit = 4) {
  assertReady();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", product.category_id ?? product.category?.id)
    .neq("id", product.id)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data || []).map(sortImages);
}

export async function createProduct(fields) {
  assertReady();
  const { data, error } = await supabase.from("products").insert(fields).select(PRODUCT_SELECT).single();
  if (error) throw error;
  return sortImages(data);
}

export async function updateProduct(id, patch) {
  assertReady();
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;
  return sortImages(data);
}

export async function deleteProduct(id) {
  assertReady();
  await deleteAllProductImages(id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export function formatPrice(product) {
  return product.price == null ? "Enquire for Price" : `PKR ${Number(product.price).toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Product images
// ---------------------------------------------------------------------------

export async function uploadProductImage(productId, file, sortOrder = 0) {
  assertReady();

  // 1. Compress and convert to WebP
  const webpFile = await compressToWebP(file, 1600, 0.6);

  // 2. Upload with a unique filename and .webp extension
  const path = `products/${productId}/${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, webpFile, {
    cacheControl: "3600",
    contentType: "image/webp",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url: pub.publicUrl, storage_path: path, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProductImage(image) {
  assertReady();
  await supabase.storage.from(BUCKET).remove([image.storage_path]);
  const { error } = await supabase.from("product_images").delete().eq("id", image.id);
  if (error) throw error;
}

async function deleteAllProductImages(productId) {
  const { data: images } = await supabase.from("product_images").select("*").eq("product_id", productId);
  if (images?.length) {
    await supabase.storage.from(BUCKET).remove(images.map((img) => img.storage_path));
  }
  // Row deletion happens via cascade when the product/category is deleted,
  // but we've already removed the storage files above.
}

export async function reorderProductImages(orderedImages) {
  assertReady();
  await Promise.all(
    orderedImages.map((img, index) => supabase.from("product_images").update({ sort_order: index }).eq("id", img.id))
  );
}

// ---------------------------------------------------------------------------
// Site settings (hero image + contact details)
// ---------------------------------------------------------------------------

export async function getSettings() {
  assertReady();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSettings(patch) {
  assertReady();
  const { data, error } = await supabase.from("site_settings").upsert(patch).eq("id", 1).select().single();
  if (error) throw error;
  return data;
}

export async function uploadHeroImage(file, previousPath) {
  assertReady();

  // 1. Compress and convert to WebP (allowing 1920px for full-width hero display)
  const webpFile = await compressToWebP(file, 1920, 0.8);

  // 2. Upload with .webp extension
  const path = `hero/${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, webpFile, {
    cacheControl: "3600",
    contentType: "image/webp",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await updateSettings({ hero_image_url: pub.publicUrl, hero_image_path: path });

  if (previousPath) {
    await supabase.storage.from(BUCKET).remove([previousPath]);
  }

  return pub.publicUrl;
}

export function whatsappLink(settings, message) {
  const number = settings?.whatsapp_number || "923000000000";
  const text = encodeURIComponent(
    message || "Hello, I'd like to enquire about a piece from The Q Collection."
  );
  return `https://wa.me/${number}?text=${text}`;
}
