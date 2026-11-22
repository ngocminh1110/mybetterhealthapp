import {
    OFF_FIELDS,
    OFF_LEGACY_SEARCH_URL,
    OFF_PRODUCT_URL,
    OFF_SEARCH_URL,
    OFF_USER_AGENT,
    REQUEST_TIMEOUT_MS,
    SEARCH_PAGE_SIZE,
} from '@/constants/api';
import type { FoodProduct, Nutrients } from '@/types/models';

/** Error with a message that is safe to show to the user. */
export class FoodApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FoodApiError';
    }
}

/** Raw JSON object from the API. We do not trust its shape, so I check every field. */
type RawObject = Record<string, unknown>;

// 1. Mapping: raw JSON -> FoodProduct
//    These are "pure functions" (no network), so they are easy to unit test.

/** Turns a number or a numeric string into a number. Anything else becomes 0. */
export function toNumber(value: unknown): number {
    const num = typeof value === 'string' ? Number(value) : value;
    return typeof num === 'number' && Number.isFinite(num) ? num : 0;
}

/**
 * A product name can be a plain string ("Banana")
 * or an object with one name per language ({ main: "Banaani", en: "Banana" }).
 * I prefer English, then the main language, then Finnish.
 */
function pickText(value: unknown): string | undefined {
    if (typeof value === 'string') return value.trim() || undefined;
    if (value && typeof value === 'object') {
        const byLanguage = value as RawObject;
        for (const key of ['en', 'main', 'fi']) {
            const text = byLanguage[key];
            if (typeof text === 'string' && text.trim()) return text.trim();
        }
    }
    return undefined;
}

/** Brands can be "Valio, Arla" or ["Valio", "Arla"]. I only show the first one. */
function pickBrand(value: unknown): string | undefined {
    if (Array.isArray(value)) return pickText(value[0]);
    return pickText(value)?.split(',')[0].trim() || undefined;
}

/**
 * Nutrition values per 100 g.
 * Some products only have energy in kJ, so we convert: kcal = kJ / 4.184.
 */
export function mapNutriments(raw: unknown): Nutrients {
    const n = (raw && typeof raw === 'object' ? raw : {}) as RawObject;

    let calories = toNumber(n['energy-kcal_100g']);
    if (!calories) {
        const kilojoules = toNumber(n['energy-kj_100g']) || toNumber(n['energy_100g']);
        calories = kilojoules / 4.184;
    }

    return {
        calories: Math.round(calories),
        protein: Math.round(toNumber(n.proteins_100g) * 10) / 10, // 1 decimal place
        carbs: Math.round(toNumber(n.carbohydrates_100g) * 10) / 10,
        fat: Math.round(toNumber(n.fat_100g) * 10) / 10,
    };
}

/** Converts one raw product. Returns null when it has no barcode or no name. */
export function mapProduct(raw: unknown): FoodProduct | null {
    if (!raw || typeof raw !== 'object') return null;
    const p = raw as RawObject;

    // The barcode can come as a string or a number
    const code = typeof p.code === 'string' || typeof p.code === 'number' ? String(p.code) : '';
    const name = pickText(p.product_name);
    if (!code || !name) return null; // without these we cannot show or save the product

    return {
        code,
        name,
        brand: pickBrand(p.brands),
        imageUrl: typeof p.image_front_small_url === 'string' ? p.image_front_small_url : undefined,
        per100g: mapNutriments(p.nutriments),
    };
}

/** True when the product has at least one nutrition value (some products have none). */
export function hasNutritionData(product: FoodProduct): boolean {
    const { calories, protein, carbs, fat } = product.per100g;
    return calories + protein + carbs + fat > 0;
}

/** Maps a list, removes invalid items and removes duplicates (same barcode). */
function mapProducts(list: unknown): FoodProduct[] {
    if (!Array.isArray(list)) return [];

    const seen = new Set<string>();
    const result: FoodProduct[] = [];
    for (const item of list) {
        const product = mapProduct(item);
        if (product && !seen.has(product.code)) {
            seen.add(product.code);
            result.push(product);
        }
    }
    return result;
}

// 2. HTTP helper

/** fetch() + timeout + User-Agent + friendly error messages. */
async function getJson(url: string, signal?: AbortSignal): Promise<RawObject> {
    // Our own controller, so we can stop the request after the timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    // If the screen cancels (for example a new search starts), cancel this request too
    const onCancel = () => controller.abort();
    signal?.addEventListener('abort', onCancel);

    try {
        const response = await fetch(url, {
            headers: { Accept: 'application/json', 'User-Agent': OFF_USER_AGENT },
            signal: controller.signal,
        });

        // 429 = too many requests, 503 = server busy
        if (response.status === 429 || response.status === 503) {
            throw new FoodApiError('Too many searches right now. Please wait a minute and try again.');
        }
        if (!response.ok) {
            throw new FoodApiError(`Food server error (${response.status}). Please try again.`);
        }
        return (await response.json()) as RawObject;
    } catch (error) {
        if (error instanceof FoodApiError) throw error;
        if (signal?.aborted) throw error; // cancelled on purpose: the caller will ignore it
        if (controller.signal.aborted) {
            throw new FoodApiError('The food server is too slow. Please try again.');
        }
        throw new FoodApiError('No internet connection. Please check your network.');
    } finally {
        // Always clean up, also when there was an error
        clearTimeout(timer);
        signal?.removeEventListener('abort', onCancel);
    }
}

// 3. Public functions (used by the screens)

/**
 * Search foods by name.
 * Tries the new search first and the old search as a backup.
 *
 */
export async function searchFoods(query: string, signal?: AbortSignal): Promise<FoodProduct[]> {
    const q = query.trim();
    if (!q) return []; // nothing to search

    const params = new URLSearchParams({
        q,
        page_size: String(SEARCH_PAGE_SIZE),
        langs: 'en',
        fields: OFF_FIELDS,
    });

    try {
        const data = await getJson(`${OFF_SEARCH_URL}?${params.toString()}`, signal);
        if (Array.isArray(data.hits)) return mapProducts(data.hits);
        throw new FoodApiError('Unexpected response from the search server.');
    } catch (error) {
        if (signal?.aborted) throw error;

        // Backup: the old search endpoint (it returns "products" instead of "hits")
        const legacyParams = new URLSearchParams({
            search_terms: q,
            search_simple: '1',
            action: 'process',
            json: '1',
            page_size: String(SEARCH_PAGE_SIZE),
            fields: OFF_FIELDS,
        });
        const data = await getJson(`${OFF_LEGACY_SEARCH_URL}?${legacyParams.toString()}`, signal);
        return mapProducts(data.products);
    }
}

/** Get one product by barcode. Returns null when the product does not exist. */
export async function getProductByCode(
    code: string,
    signal?: AbortSignal,
): Promise<FoodProduct | null> {
    const clean = code.trim();
    if (!/^\d{4,14}$/.test(clean)) return null; // a barcode has only digits

    const data = await getJson(`${OFF_PRODUCT_URL}/${clean}?fields=${OFF_FIELDS}`, signal);

    // The API answers status 1 = found, status 0 = not found
    if (toNumber(data.status) !== 1) return null;
    return mapProduct({ ...(data.product as RawObject), code: clean });
}