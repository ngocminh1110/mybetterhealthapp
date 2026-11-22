import { getProductByCode, mapNutriments, mapProduct, searchFoods } from '../foodApi';

/**
 * These tests do NOT use the internet.
 * I replace fetch() with a fake function (a "mock"), so we decide what the server answers.
 */

/** Creates a fake fetch() response with a JSON body and an HTTP status. */
function jsonResponse(body: unknown, status = 200) {
    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
    } as Response);
}

const fetchMock = jest.fn();

beforeEach(() => {
    // Start every test with a clean fake fetch()
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe('mapNutriments', () => {
    it('reads kcal and macros per 100 g (numbers or strings)', () => {
        expect(
            mapNutriments({
                'energy-kcal_100g': 89,
                proteins_100g: '1.09',
                carbohydrates_100g: 22.84,
                fat_100g: 0.33,
            }),
        ).toEqual({ calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 });
    });

    it('converts kJ to kcal when kcal is missing', () => {
        expect(mapNutriments({ 'energy-kj_100g': 418.4 }).calories).toBe(100);
    });

    it('returns zeros when nutriments are missing', () => {
        expect(mapNutriments(undefined)).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    });
});

describe('mapProduct', () => {
    it('maps a product with a plain string name', () => {
        const product = mapProduct({
            code: '6408430000012',
            product_name: 'Oat drink',
            brands: 'Oatly, Other brand',
            image_front_small_url: 'https://example.com/img.jpg',
            nutriments: { 'energy-kcal_100g': 46 },
        });

        expect(product).toEqual({
            code: '6408430000012',
            name: 'Oat drink',
            brand: 'Oatly',
            imageUrl: 'https://example.com/img.jpg',
            per100g: { calories: 46, protein: 0, carbs: 0, fat: 0 },
        });
    });

    it('maps a name per language and brands as a list', () => {
        const product = mapProduct({
            code: 123456,
            product_name: { main: 'Ruisleipä', en: 'Rye bread' },
            brands: ['Fazer'],
        });

        expect(product?.name).toBe('Rye bread');
        expect(product?.brand).toBe('Fazer');
        expect(product?.code).toBe('123456');
    });

    it('returns null without a barcode or a name', () => {
        expect(mapProduct({ product_name: 'No code' })).toBeNull();
        expect(mapProduct({ code: '123', product_name: '  ' })).toBeNull();
        expect(mapProduct(null)).toBeNull();
    });
});

describe('searchFoods', () => {
    it('returns mapped results and removes invalid items and duplicates', async () => {
        fetchMock.mockReturnValueOnce(
            jsonResponse({
                hits: [
                    { code: '1111', product_name: 'Banana' },
                    { code: '1111', product_name: 'Banana duplicate' }, // same barcode -> removed
                    { code: '2222' }, // no name -> removed
                ],
            }),
        );

        const results = await searchFoods('banana');

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Banana');
        expect(fetchMock.mock.calls[0][0]).toContain('search.openfoodfacts.org/search?q=banana');
    });

    it('uses the old search when the new search fails', async () => {
        fetchMock
            .mockReturnValueOnce(jsonResponse({}, 503)) // new search: server busy
            .mockReturnValueOnce(jsonResponse({ products: [{ code: '3333', product_name: 'Apple' }] }));

        const results = await searchFoods('apple');

        expect(results.map((p) => p.name)).toEqual(['Apple']);
        expect(fetchMock.mock.calls[1][0]).toContain('cgi/search.pl');
    });

    it('throws a friendly error when both searches fail', async () => {
        fetchMock.mockReturnValue(jsonResponse({}, 503));
        await expect(searchFoods('apple')).rejects.toThrow('Too many searches');
    });

    it('does not call the API for an empty search', async () => {
        await expect(searchFoods('   ')).resolves.toEqual([]);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});

describe('getProductByCode', () => {
    it('returns the product when it exists', async () => {
        fetchMock.mockReturnValueOnce(jsonResponse({ status: 1, product: { product_name: 'Milk' } }));

        const product = await getProductByCode('6408430000012');

        expect(product?.name).toBe('Milk');
        expect(product?.code).toBe('6408430000012');
    });

    it('returns null when the product is not found', async () => {
        fetchMock.mockReturnValueOnce(jsonResponse({ status: 0, status_verbose: 'product not found' }));
        expect(await getProductByCode('0000000000000')).toBeNull();
    });

    it('returns null for an invalid barcode without calling the API', async () => {
        expect(await getProductByCode('abc')).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});