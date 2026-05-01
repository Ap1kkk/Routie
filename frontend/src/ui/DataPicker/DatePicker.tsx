import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ConfigProvider, DatePicker as AntdDatePicker, Space } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import ruPickerLocale from 'antd/es/date-picker/locale/ru_RU';

import { Button } from '../Button/Button';

import styles from './DatePicker.module.scss';

export interface DatePickerProps {
	date?: number | string | null;
	onChange?: (date: number | string | null) => void;
	helperText?: string;
	error?: boolean;
	placeholder?: string;
	allowClear?: boolean;
	disabled?: boolean;
	id?: string;
	label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
	date = null,
	onChange,
	helperText,
	error = false,
	placeholder = 'ДД.ММ.ГГГГ',
	allowClear = true,
	disabled = false,
	id,
	label,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [tempDate, setTempDate] = useState<Dayjs | null>(
		date ? dayjs(date) : null
	);
	const pickerRef = useRef<any>(null);

	const parsedDate = useMemo(() => (date ? dayjs(date) : null), [date]);
	const resolvedId = id ?? 'date-picker-input';

	const convertOut = (value: Dayjs | null) => {
		if (!value) return null;
		if (typeof date === 'string') {
			return value.toISOString();
		}
		return value.valueOf();
	};

	const handleOk = () => {
		if (onChange) {
			onChange(convertOut(tempDate));
		}
		setIsOpen(false);
	};

	const handleCancel = () => {
		setIsOpen(false);
	};

	const handleOpenChange = (open: boolean) => {
		if (open) {
			setTempDate(parsedDate);
			setIsOpen(true);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isOpen && pickerRef.current) {
				const popupElement = document.querySelector(
					'.ant-picker-dropdown'
				);
				if (
					popupElement &&
					!popupElement.contains(event.target as Node)
				) {
					handleCancel();
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, parsedDate]);

	const renderExtraFooter = () => (
		<div className={styles.customFooter}>
			<div className={styles.customFooterButtons}>
				<Button
					variant='secondary'
					onClick={handleCancel}
					className={styles.footerBtn}>
					Отменить
				</Button>
				<Button
					variant='primary'
					onClick={handleOk}
					className={styles.footerBtn}>
					Выбрать
				</Button>
			</div>
		</div>
	);

	return (
		<ConfigProvider locale={ruRU}>
			<Space direction='vertical' size={4} className={styles.container}>
				{label && (
					<label htmlFor={resolvedId} className={styles.label}>
						{label}
					</label>
				)}
				<div ref={pickerRef}>
					<AntdDatePicker
						id={resolvedId}
						locale={ruPickerLocale}
						value={isOpen ? tempDate : parsedDate}
						onChange={(val) => setTempDate(val)}
						open={isOpen}
						onOpenChange={handleOpenChange}
						placeholder={placeholder}
						disabled={disabled}
						status={error ? 'error' : undefined}
						format='DD.MM.YYYY'
						popupClassName={styles.popup}
						renderExtraFooter={renderExtraFooter}
						showToday={false}
						allowClear={allowClear}
					/>
				</div>
				{(error || helperText) && (
					<div className={styles['message-container']}>
						{helperText && !error && (
							<p className={styles.helperText}>{helperText}</p>
						)}
						{error && <p className={styles.errorText}>{error}</p>}
					</div>
				)}
			</Space>
		</ConfigProvider>
	);
};
