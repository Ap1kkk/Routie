import React, { useState } from 'react';
import { Tags } from '../../types/tags';
import { Filters } from '../../types/filters';
import { Filter } from '@components';
import { mockRoutes } from '../../mocks/route';

import styles from './FilterMobilePage.module.scss';

export const FilterMobilePage: React.FC = () => {
	const [activeFilters, setActiveFilters] = useState<Filters | null>(null);

	const tags: Tags[] = [
		{ id: '1', label: 'Исторический' },
		{ id: '2', label: 'Природный' },
		{ id: '3', label: 'Городской' },
		{ id: '4', label: 'Водный' },
		{ id: '5', label: 'Горный' },
		{ id: '6', label: 'Архитектурный' },
		{ id: '7', label: 'Религиозный' },
		{ id: '8', label: 'Современный' },
	];

	const handleApplyFilters = (filters: Filters) => {
		setActiveFilters(filters);
		console.log('Applied filters:', filters);

		let filteredRoutes = [...mockRoutes];

		if (filters.distance.min > 0 || filters.distance.max < Infinity) {
			filteredRoutes = filteredRoutes.filter(
				(route) =>
					route.distance >= filters.distance.min &&
					route.distance <= filters.distance.max
			);
		}

		if (
			filters.checkpointsCount.min > 0 ||
			filters.checkpointsCount.max < Infinity
		) {
			filteredRoutes = filteredRoutes.filter(
				(route) =>
					route.checkpoints.length >= filters.checkpointsCount.min &&
					route.checkpoints.length <= filters.checkpointsCount.max
			);
		}

		if (filters.categoryIds.length > 0) {
			filteredRoutes = filteredRoutes.filter((route) =>
				route.tags?.some((tag) => filters.categoryIds.includes(tag.id))
			);
		}
	};

	const handleResetFilters = () => {
		setActiveFilters(null);
	};

	return (
		<section className={styles.container}>
			<Filter
				onApply={handleApplyFilters}
				onReset={handleResetFilters}
				tags={tags}
			/>
		</section>
	);
};
