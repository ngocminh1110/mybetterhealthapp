/**
 * Open Food Facts API settings.
 * Docs: https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/
 *
 * Open Food Facts is free and open. It does not need an API key.
 */

/** Full-text search by food name (Search-a-licious). Recommended by Open Food Facts. */
export const OFF_SEARCH_URL = 'https://search.openfoodfacts.org/search';

/** Old full-text search. We only use it as a backup when the new search fails. */
export const OFF_LEGACY_SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

/** Get one product by its barcode (used later by the barcode scanner). */
export const OFF_PRODUCT_URL = 'https://world.openfoodfacts.org/api/v2/product';

/** Only ask for the fields we use. This makes the response smaller and faster. */
export const OFF_FIELDS = 'code,product_name,brands,image_front_small_url,nutriments';

/**
 * Open Food Facts asks every app to send its own User-Agent:
 * "AppName/Version (contact)". You can add your school email inside the brackets.
 */
export const OFF_USER_AGENT = 'MyBetterHealth/1.0 (Haaga-Helia student project)';

/** How many results one search returns. */
export const SEARCH_PAGE_SIZE = 20;

/** Stop waiting for the server after 10 seconds. */
export const REQUEST_TIMEOUT_MS = 10000;