import { useCallback, useEffect, useRef, useState } from 'react';

interface InfiniteResponse<T> {
	content: T[];
	totalPages: number;
}

interface UseInfiniteScrollOptions<T> {
	loadPage: (page: number, size: number) => Promise<InfiniteResponse<T>>;
	pageSize?: number;
	getItemId?: (item: T) => string;
}

export const useInfiniteScroll = <T>({
	loadPage,
	pageSize = 20,
	getItemId,
}: UseInfiniteScrollOptions<T>) => {
	const [items, setItems] = useState<T[]>([]);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [reloadKey, setReloadKey] = useState(0);
	const loadingRef = useRef(false);

	const fetchPage = useCallback(
		async (pageNumber: number) => {
			if (loadingRef.current) return;

			loadingRef.current = true;
			setLoading(true);

			try {
				const result = await loadPage(pageNumber, pageSize);

				setItems((prev) => {
					if (!getItemId) {
						return [...prev, ...result.content];
					}

					const existingIds = new Set(
						prev.map((item) => getItemId(item))
					);

					return [
						...prev,
						...result.content.filter(
							(item) => !existingIds.has(getItemId(item))
						),
					];
				});

				setHasMore(pageNumber + 1 < result.totalPages);
			} finally {
				loadingRef.current = false;
				setLoading(false);
			}
		},
		[loadPage, pageSize, getItemId]
	);

	useEffect(() => {
		if (hasMore) {
			fetchPage(page);
		}
	}, [page, reloadKey]);

	const observer = useRef<IntersectionObserver | null>(null);

	const loaderRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;

			observer.current?.disconnect();

			observer.current = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting && hasMore) {
						setPage((prev) => prev + 1);
					}
				},
				{
					rootMargin: '300px',
				}
			);

			if (node) {
				observer.current.observe(node);
			}
		},
		[loading, hasMore]
	);

	const reset = useCallback(() => {
		loadingRef.current = false;

		setItems([]);
		setHasMore(true);
		setPage(0);
		setReloadKey((v) => v + 1);
	}, []);

	return {
		items,
		loading,
		hasMore,
		reset,
		loaderRef,
	};
};