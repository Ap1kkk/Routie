import React, { useState } from 'react';
import { Tags } from '../../types/tags';
import { Filters } from '../../types/filters';
import { Button, Input, Tag } from '@ui';
import Slider from 'rc-slider';

import { ReactComponent as Star } from '../../assets/icons/star.svg';

import styles from './Filter.module.scss';
import './index.css';

interface FilterModalProps {
	onApply: (filters: Filters) => void;
	onReset: () => void;
	tags?: Tags[];
}

export const Filter: React.FC<FilterModalProps> = ({
	onApply,
	onReset,
	tags = [],
}) => {
	const [filters, setFilters] = useState<Filters>({
		distance: { min: 0, max: 10000 },
		checkpointsCount: { min: 0, max: 50 },
		categoryIds: [],
		duration: { min: 0, max: 24 },
		difficulty: [],
		rating: 0,
	});

	const [tempFilters, setTempFilters] = useState<Filters>(filters);
	const [distanceRange, setDistanceRange] = useState<[number, number]>([
		filters.distance.min,
		filters.distance.max,
	]);
	const [checkpointsRange, setCheckpointsRange] = useState<[number, number]>([
		filters.checkpointsCount.min,
		filters.checkpointsCount.max,
	]);
	const [durationRange, setDurationRange] = useState<[number, number]>([
		filters.duration.min,
		filters.duration.max,
	]);

	const handleDistanceChange = (type: 'min' | 'max', value: number) => {
		let newMin = tempFilters.distance.min;
		let newMax = tempFilters.distance.max;

		if (type === 'min') {
			newMin = Math.min(value, tempFilters.distance.max - 1);
		} else {
			newMax = Math.max(value, tempFilters.distance.min + 1);
		}

		setTempFilters((prev) => ({
			...prev,
			distance: { min: newMin, max: newMax },
		}));
		setDistanceRange([newMin, newMax]);
	};

	const handleDistanceRangeChange = (value: number | number[]) => {
		if (Array.isArray(value)) {
			const [min, max] = value;
			setDistanceRange([min, max]);
			setTempFilters((prev) => ({
				...prev,
				distance: { min, max },
			}));
		}
	};

	const handleCheckpointsChange = (type: 'min' | 'max', value: number) => {
		let newMin = tempFilters.checkpointsCount.min;
		let newMax = tempFilters.checkpointsCount.max;

		if (type === 'min') {
			newMin = Math.min(value, tempFilters.checkpointsCount.max - 1);
		} else {
			newMax = Math.max(value, tempFilters.checkpointsCount.min + 1);
		}

		setTempFilters((prev) => ({
			...prev,
			checkpointsCount: { min: newMin, max: newMax },
		}));
		setCheckpointsRange([newMin, newMax]);
	};

	const handleCheckpointsRangeChange = (value: number | number[]) => {
		if (Array.isArray(value)) {
			const [min, max] = value;
			setCheckpointsRange([min, max]);
			setTempFilters((prev) => ({
				...prev,
				checkpointsCount: { min, max },
			}));
		}
	};

	const handleDurationChange = (type: 'min' | 'max', value: number) => {
		let newMin = tempFilters.duration.min;
		let newMax = tempFilters.duration.max;

		if (type === 'min') {
			newMin = Math.min(value, tempFilters.duration.max - 0.5);
		} else {
			newMax = Math.max(value, tempFilters.duration.min + 0.5);
		}

		setTempFilters((prev) => ({
			...prev,
			duration: { min: newMin, max: newMax },
		}));
		setDurationRange([newMin, newMax]);
	};

	const handleDurationRangeChange = (value: number | number[]) => {
		if (Array.isArray(value)) {
			const [min, max] = value;
			setDurationRange([min, max]);
			setTempFilters((prev) => ({
				...prev,
				duration: { min, max },
			}));
		}
	};

	const handleCategoryToggle = (categoryId: string) => {
		setTempFilters((prev) => ({
			...prev,
			categoryIds: prev.categoryIds.includes(categoryId)
				? prev.categoryIds.filter((id) => id !== categoryId)
				: [...prev.categoryIds, categoryId],
		}));
	};

	const handleRatingChange = (rating: number) => {
		setTempFilters((prev) => ({ ...prev, rating }));
	};

	const handleApply = () => {
		setFilters(tempFilters);
		onApply(tempFilters);
	};

	const handleReset = () => {
		const defaultFilters: Filters = {
			distance: { min: 0, max: 10000 },
			checkpointsCount: { min: 0, max: 50 },
			categoryIds: [],
			duration: { min: 0, max: 24 },
			difficulty: [],
			rating: 0,
		};
		setTempFilters(defaultFilters);
		setFilters(defaultFilters);
		setDistanceRange([
			defaultFilters.distance.min,
			defaultFilters.distance.max,
		]);
		setCheckpointsRange([
			defaultFilters.checkpointsCount.min,
			defaultFilters.checkpointsCount.max,
		]);
		setDurationRange([
			defaultFilters.duration.min,
			defaultFilters.duration.max,
		]);
		onReset();
	};

	const handleCancel = () => {
		setTempFilters(filters);
		setDistanceRange([filters.distance.min, filters.distance.max]);
		setCheckpointsRange([
			filters.checkpointsCount.min,
			filters.checkpointsCount.max,
		]);
		setDurationRange([filters.duration.min, filters.duration.max]);
	};

	// Преобразуем теги в формат, который ожидает компонент Tag
	const tagItems = tags.map((tag) => ({
		id: tag.id,
		label: tag.label,
	}));

	return (
		<div className={styles.filter}>
			<h2 className={styles.filterMainTitle}>Фильтрация маршрутов</h2>

			<div className={styles.filterSection}>
				<span className={styles.filterTitle}>Расстояние (метры)</span>
				<div className={styles.rangeInputs}>
					<Input
						type='number'
						value={tempFilters.distance.min}
						onChange={(e) =>
							handleDistanceChange('min', Number(e.target.value))
						}
						min={0}
						max={tempFilters.distance.max}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
					<Input
						type='number'
						value={tempFilters.distance.max}
						onChange={(e) =>
							handleDistanceChange('max', Number(e.target.value))
						}
						min={tempFilters.distance.min}
						max={10000}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
				</div>
				<Slider
					range
					min={0}
					max={10000}
					value={distanceRange}
					onChange={handleDistanceRangeChange}
					className={styles.rangeSlider}
				/>
			</div>

			<div className={styles.filterSection}>
				<span className={styles.filterTitle}>
					Количество точек маршрута
				</span>
				<div className={styles.rangeInputs}>
					<Input
						type='number'
						value={tempFilters.checkpointsCount.min}
						onChange={(e) =>
							handleCheckpointsChange(
								'min',
								Number(e.target.value)
							)
						}
						min={0}
						max={tempFilters.checkpointsCount.max}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
					<Input
						type='number'
						value={tempFilters.checkpointsCount.max}
						onChange={(e) =>
							handleCheckpointsChange(
								'max',
								Number(e.target.value)
							)
						}
						min={tempFilters.checkpointsCount.min}
						max={50}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
				</div>
				<Slider
					range
					min={0}
					max={50}
					value={checkpointsRange}
					onChange={handleCheckpointsRangeChange}
					className={styles.rangeSlider}
				/>
			</div>

			<div className={styles.filterSection}>
				<span className={styles.filterTitle}>
					Время прохождения (часы)
				</span>
				<div className={styles.rangeInputs}>
					<Input
						type='number'
						step={0.5}
						value={tempFilters.duration.min}
						onChange={(e) =>
							handleDurationChange('min', Number(e.target.value))
						}
						min={0}
						max={tempFilters.duration.max}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
					<Input
						type='number'
						step={0.5}
						value={tempFilters.duration.max}
						onChange={(e) =>
							handleDurationChange('max', Number(e.target.value))
						}
						min={tempFilters.duration.min}
						max={24}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
				</div>
				<Slider
					range
					min={0}
					max={24}
					step={0.5}
					value={durationRange}
					onChange={handleDurationRangeChange}
					className={styles.rangeSlider}
				/>
			</div>

			{tags.length > 0 && (
				<div className={styles.filterSection}>
					<span className={styles.filterTitle}>Категории</span>
					<div className={styles.categoriesList}>
						<Tag
							variant='selectable'
							items={tagItems}
							selectedIds={tempFilters.categoryIds}
							onTagClick={(id) => {
								if (id && typeof id === 'string') {
									handleCategoryToggle(id);
								}
							}}
							wrap={true}
						/>
					</div>
				</div>
			)}

			<div className={styles.filterSection}>
				<span className={styles.filterTitle}>Рейтинг</span>
				<div className={styles.ratingButtons}>
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							className={`${styles.ratingStar} ${
								tempFilters.rating >= star ? styles.active : ''
							}`}
							onClick={() => handleRatingChange(star)}>
							{star}
							<Star className={styles.star} />
						</button>
					))}
					{tempFilters.rating > 0 && (
						<Button
							className={styles.ratingClear}
							variant='secondary'
							onClick={() => handleRatingChange(0)}
							children='Сбросить'
						/>
					)}
				</div>
			</div>

			<div className={styles.filterModalFooter}>
				<Button
					className={styles.resetBtn}
					onClick={handleReset}
					variant='secondary'>
					Сбросить все
				</Button>
				<div className={styles.actionButtons}>
					<Button
						className={styles.cancelBtn}
						onClick={handleCancel}
						variant='secondary'>
						Отмена
					</Button>
					<Button variant='primary' onClick={handleApply}>
						Применить
					</Button>
				</div>
			</div>
		</div>
	);
};
