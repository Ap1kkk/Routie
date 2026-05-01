import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as ChevronDownIcon } from '../../assets/icons/chevron-down.svg';

import styles from './Select.module.scss';

interface Option {
	value: string;
	label: string;
}

interface SelectProps {
	options: Option[];
	value?: string;
	values?: string[];
	onChange?: (value: string) => void;
	onChangeMultiple?: (values: string[]) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	multiple?: boolean;
	className?: string;
}

export const Select: React.FC<SelectProps> = ({
	options,
	value,
	values = [],
	onChange,
	onChangeMultiple,
	placeholder = 'Выберите вариант',
	label,
	error,
	disabled = false,
	multiple = false,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedOption =
		!multiple && value
			? options.find((opt) => opt.value === value)
			: undefined;

	const selectedOptions = multiple
		? options.filter((opt) => values.includes(opt.value))
		: [];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (optionValue: string) => {
		if (disabled) return;

		if (multiple && onChangeMultiple) {
			const newValues = values.includes(optionValue)
				? values.filter((v) => v !== optionValue)
				: [...values, optionValue];
			onChangeMultiple(newValues);
		} else if (!multiple && onChange) {
			onChange(optionValue);
			setIsOpen(false);
		}
	};

	const toggleOpen = () => {
		if (disabled) return;
		setIsOpen(!isOpen);
	};

	const getDisplayText = () => {
		if (multiple) {
			if (selectedOptions.length === 0) return placeholder;
			if (selectedOptions.length === 1) return selectedOptions[0].label;
			return `Выбрано: ${selectedOptions.length}`;
		}
		return selectedOption ? selectedOption.label : placeholder;
	};

	return (
		<div className={`${styles.wrapper} ${className}`} ref={containerRef}>
			{label && <label className={styles.label}>{label}</label>}

			<div
				className={`${styles.select} ${error ? styles.error : ''} ${
					disabled ? styles.disabled : ''
				}`}
				onClick={toggleOpen}>
				<span
					className={
						selectedOption || selectedOptions.length > 0
							? styles.value
							: styles.placeholder
					}>
					{getDisplayText()}
				</span>
				<ChevronDownIcon
					className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
				/>
			</div>

			{isOpen && !disabled && (
				<ul className={styles.dropdown}>
					{options.map((option) => {
						const isSelected = multiple
							? values.includes(option.value)
							: option.value === value;

						return (
							<li
								key={option.value}
								className={`${styles.option} ${
									isSelected ? styles.selected : ''
								}`}
								onClick={() => handleSelect(option.value)}>
								{multiple && (
									<span className={styles.checkbox}>
										{isSelected && (
											<span className={styles.checkmark}>
												✓
											</span>
										)}
									</span>
								)}
								<span className={styles['option-label']}>
									{option.label}
								</span>
							</li>
						);
					})}
				</ul>
			)}
			{error && (
				<div className={styles['message-container']}>
					{error && (
						<p className={styles['error-message']}>{error}</p>
					)}
				</div>
			)}
		</div>
	);
};
