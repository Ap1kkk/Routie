import React from 'react';
import styles from './FilterMobilePage.module.scss';
import { useDispatch, useSelector } from '@store';
import {
	resetFilters,
	setFilters,
} from '../../services/slices/filterSlice/filterSlice';
import { Filters } from '../../types/Filters';
import { useNavigate } from 'react-router-dom';
import { Filter } from '@components';

export const FilterMobilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const filters = useSelector((state) => state.filters.filters);

	const handleApplyFilters = (filters: Filters) => {
		dispatch(setFilters(filters));
		navigate(-1);
	};

	const handleResetFilters = () => {
		dispatch(resetFilters());
	};

	return (
		<section className={styles.container}>
			<Filter onApply={handleApplyFilters} onReset={handleResetFilters} />
		</section>
	);
};
