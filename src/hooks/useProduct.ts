import { useCallback, useEffect, useState } from 'react';

import { FoodApiError, getProductByCode } from '@/services/foodApi';
import type { FoodProduct } from '@/types/models';

/** The states of loading one product. "not-found" = the barcode is not in Open Food Facts. */
export type ProductStatus = 'loading' | 'success' | 'not-found' | 'error';

interface ProductResult {
    key: string;
    status: Exclude<ProductStatus, 'loading'>;
    product: FoodProduct | null;
    error?: string;
}

/**
 * Loads one product by its barcode.
 */
export function useProduct(code: string | undefined) {
    const [result, setResult] = useState<ProductResult | null>(null);
    const [reloadCount, setReloadCount] = useState(0);

    const requestKey = `${code}:${reloadCount}`;

    useEffect(() => {
        if (!code) return;

        // Cancel the request if the screen closes before the answer comes
        const controller = new AbortController();

        getProductByCode(code, controller.signal)
            .then((product) => {
                if (controller.signal.aborted) return;
                setResult({ key: requestKey, status: product ? 'success' : 'not-found', product });
            })
            .catch((e: unknown) => {
                if (controller.signal.aborted) return;
                const message = e instanceof FoodApiError ? e.message : 'Something went wrong. Please try again.';
                setResult({ key: requestKey, status: 'error', product: null, error: message });
            });

        return () => controller.abort();
    }, [code, requestKey]);

    const isCurrent = result?.key === requestKey;
    const status: ProductStatus = !code ? 'not-found' : isCurrent ? result.status : 'loading';

    /** Loads the product again (for the "Try again" button). */
    const retry = useCallback(() => setReloadCount((count) => count + 1), []);

    return {
        status,
        product: isCurrent ? result.product : null,
        error: isCurrent ? result.error : undefined,
        retry,
    };
}