import { useCallback, useEffect, useRef, useState } from 'react';

import { FoodApiError, searchFoods } from '@/services/foodApi';
import type { FoodProduct } from '@/types/models';

/** The 4 states of a search, used by the screen to decide what to show. */
export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Custom hook that keeps all the search logic out of the screen.
 * The screen only calls `search(text)` and reads `status`, `results` and `error`.
 */
export function useFoodSearch() {
    const [status, setStatus] = useState<SearchStatus>('idle'); // nothing searched yet
    const [results, setResults] = useState<FoodProduct[]>([]);
    const [error, setError] = useState<string>();
    const [lastQuery, setLastQuery] = useState(''); // used by "Try again"

    // Remembers the running request, so I can cancel it when a new search starts
    const controllerRef = useRef<AbortController | null>(null);

    const search = useCallback(async (query: string) => {
        const q = query.trim();

        // Very short words give useless results and waste our limit of searches
        if (q.length < 2) {
            setStatus('error');
            setError('Please type at least 2 letters.');
            return;
        }

        // Cancel the previous search if it is still running
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLastQuery(q);
        setStatus('loading');
        setError(undefined);

        try {
            const items = await searchFoods(q, controller.signal);
            if (controller.signal.aborted) return; // a newer search replaced this one
            setResults(items);
            setStatus('success');
        } catch (e) {
            if (controller.signal.aborted) return;
            setResults([]);
            // Show our friendly message, or a general one for unknown errors
            setError(e instanceof FoodApiError ? e.message : 'Something went wrong. Please try again.');
            setStatus('error');
        }
    }, []);

    /** Runs the last search again (for the "Try again" button). */
    const retry = useCallback(() => search(lastQuery), [search, lastQuery]);

    // When the screen closes, cancel the request that is still running
    useEffect(() => () => controllerRef.current?.abort(), []);

    return { status, results, error, lastQuery, search, retry };
}