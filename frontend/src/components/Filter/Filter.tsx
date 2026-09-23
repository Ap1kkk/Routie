import React, { useState } from 'react';
import { Tags } from '../../types/Tags';
import { Button, Input, Tag } from '@ui';
import Slider from 'rc-slider';
import { defaultFilters, Filters } from '../../types/Filters';

import styles from './Filter.module.scss';
import './index.css';

interface FilterModalProps {
	onApply?: (filters: Filters) => void;
	onReset: () => void;
	tags?: Tags[];
}

export const Filter: React.FC<FilterModalProps> = ({
	onApply,
	onReset,
	tags = [],
}) => {
	const [filters, setFilters] = useState<Filters>({
		lengthMin: 0,
		lengthMax: 10000,
		estimatedTimeMin: 0,
		estimatedTimeMax: 24,
		tags: [],
	});
	const [tempFilters, setTempFilters] = useState<Filters>(filters);
	const [distanceRange, setDistanceRange] = useState<[number, number]>([
		filters.lengthMin ?? 0,
		filters.lengthMax ?? 10000,
	]);

	const [durationRange, setDurationRange] = useState<[number, number]>([
		filters.estimatedTimeMin ?? 0,
		filters.estimatedTimeMax ?? 24,
	]);

	const handleDistanceChange = (type: 'min' | 'max', value: number) => {
		let newMin = tempFilters.lengthMin ?? 0;
		let newMax = tempFilters.lengthMax ?? 10000;

		if (type === 'min') {
			newMin = Math.min(value, newMax - 1);
		} else {
			newMax = Math.max(value, newMin + 1);
		}

		setTempFilters((prev) => ({
			...prev,
			lengthMin: newMin,
			lengthMax: newMax,
		}));

		setDistanceRange([newMin, newMax]);
	};

	const handleDistanceRangeChange = (value: number | number[]) => {
		if (Array.isArray(value)) {
			const [min, max] = value;

			setDistanceRange([min, max]);

			setTempFilters((prev) => ({
				...prev,
				lengthMin: min,
				lengthMax: max,
			}));
		}
	};

	const handleDurationChange = (type: 'min' | 'max', value: number) => {
		let newMin = tempFilters.estimatedTimeMin ?? 0;
		let newMax = tempFilters.estimatedTimeMax ?? 24;

		if (type === 'min') {
			newMin = Math.min(value, newMax - 0.5);
		} else {
			newMax = Math.max(value, newMin + 0.5);
		}

		setTempFilters((prev) => ({
			...prev,
			estimatedTimeMin: newMin,
			estimatedTimeMax: newMax,
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

	const handleCategoryToggle = (tagId: string) => {
		setTempFilters((prev) => ({
			...prev,
			tags: prev.tags?.includes(tagId)
				? prev.tags.filter((id) => id !== tagId)
				: [...(prev.tags ?? []), tagId],
		}));
	};

	const handleApply = () => {
		setFilters(tempFilters);
		onApply?.(tempFilters);
	};

	const handleReset = () => {
		setTempFilters(defaultFilters);
		setFilters(defaultFilters);

		setDistanceRange([
			defaultFilters.lengthMin ?? 0,
			defaultFilters.lengthMax ?? 10000,
		]);

		setDurationRange([
			defaultFilters.estimatedTimeMin ?? 0,
			defaultFilters.estimatedTimeMax ?? 24,
		]);

		onReset();
	};

	const handleCancel = () => {
		setTempFilters(filters);

		setDistanceRange([filters.lengthMin ?? 0, filters.lengthMax ?? 10000]);

		setDurationRange([
			filters.estimatedTimeMin ?? 0,
			filters.estimatedTimeMax ?? 24,
		]);
	};

	const tagItems = tags.map((tag) => ({
		id: tag.id,
		label: tag.title,
	}));

	return (
		<div className={styles.filter}>
			<h2 className={styles.filterMainTitle}>Фильтрация маршрутов</h2>

			<div className={styles.filterSection}>
				<span className={styles.filterTitle}>Расстояние (метры)</span>
				<div className={styles.rangeInputs}>
					<Input
						type='number'
						value={tempFilters.lengthMin ?? 0}
						onChange={(e) =>
							handleDistanceChange('min', Number(e.target.value))
						}
						min={0}
						max={tempFilters.lengthMax ?? 10000}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
					<Input
						type='number'
						value={tempFilters.lengthMax ?? 10000}
						onChange={(e) =>
							handleDistanceChange('max', Number(e.target.value))
						}
						min={tempFilters.lengthMin ?? 0}
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
					Время прохождения (часы)
				</span>
				<div className={styles.rangeInputs}>
					<Input
						type='number'
						step={0.5}
						value={tempFilters.estimatedTimeMin ?? 0}
						onChange={(e) =>
							handleDurationChange('min', Number(e.target.value))
						}
						min={0}
						max={tempFilters.estimatedTimeMax ?? 24}
						showNumberArrows={false}
						inputPadding='3px 10px'
						className={styles.inputFilter}
					/>
					<Input
						type='number'
						step={0.5}
						value={tempFilters.estimatedTimeMax ?? 24}
						onChange={(e) =>
							handleDurationChange('max', Number(e.target.value))
						}
						min={tempFilters.estimatedTimeMin ?? 0}
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
							selectedIds={tempFilters.tags ?? []}
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
