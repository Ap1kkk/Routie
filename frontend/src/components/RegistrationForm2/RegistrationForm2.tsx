import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
	validateName,
	formatName,
	sanitizeName,
	validateImages,
	validateWeight,
	validateHeight,
	validateAge,
} from '../../utils/validator';
import { Avatar, Input, Button, Select } from '@ui';
import { DatePicker } from '../../ui/DataPicker';
import { useDeviceType } from '../../hooks/useDeviceType';

import { ReactComponent as IconAdd } from '../../assets/icons/IconAdd.svg';

import s from '../RegistrationForm/RegistrationForm.module.scss';
import styles from './RegistrationForm2.module.scss';

interface RegistrationForm2Props {
	data: {
		name: string;
		gender?: string;
		birthDate?: string | number | null;
		weight: number | string;
		height: number | string;
		avatar?: File | null;
	};
	updateData: (key: string, value: unknown) => void;
	onNext: () => void;
	onPrev: () => void;
}

export const RegistrationForm2 = ({
	data,
	updateData,
	onNext,
	onPrev,
}: RegistrationForm2Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		data.avatar ? URL.createObjectURL(data.avatar) : null
	);
	const [avatarError, setAvatarError] = useState<string | undefined>();

	const [name, setName] = useState(data.name || '');
	const [gender, setGender] = useState(data.gender || '');
	const [birthDate, setBirthDate] = useState<string | number | null>(
		data.birthDate || null
	);
	const [weight, setWeight] = useState<string | number>(data.weight || '');
	const [height, setHeight] = useState<string | number>(data.height || '');

	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

	const [touched, setTouched] = useState({
		name: false,
		gender: false,
		birthDate: false,
		weight: false,
		height: false,
	});

	// Очистка preview при размонтировании
	useEffect(() => {
		return () => {
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview]);

	// Синхронизация данных из props
	useEffect(() => {
		setName(data.name || '');
		setGender(data.gender || '');
		setBirthDate(data.birthDate || null);
		setWeight(data.weight || '');
		setHeight(data.height || '');
	}, [data]);

	// Валидации
	const nameValidation = useMemo(() => {
		if (!name?.trim()) {
			return { isValid: false, errorMessage: 'Имя обязательно' };
		}
		return validateName(name);
	}, [name]);

	const genderValidation = useMemo(() => {
		return gender
			? { isValid: true, errorMessage: '' }
			: { isValid: false, errorMessage: 'Выберите пол' };
	}, [gender]);

	const birthDateValidation = useMemo(() => {
		if (!birthDate) {
			return { isValid: false, errorMessage: 'Укажите дату рождения' };
		}
		const selectedDate = new Date(birthDate);
		if (isNaN(selectedDate.getTime())) {
			return { isValid: false, errorMessage: 'Некорректная дата' };
		}
		return validateAge(selectedDate);
	}, [birthDate]);

	const weightValidation = useMemo(() => validateWeight(weight), [weight]);
	const heightValidation = useMemo(() => validateHeight(height), [height]);

	const showNameError = touched.name && !nameValidation.isValid;
	const showGenderError = touched.gender && !genderValidation.isValid;
	const showWeightError = touched.weight && !weightValidation.isValid;
	const showHeightError = touched.height && !heightValidation.isValid;

	// Основная проверка заполненности и валидности
	const isAllFieldsFilled = useMemo(() => {
		return (
			name?.trim().length > 0 &&
			gender?.length > 0 &&
			birthDate != null &&
			birthDate !== '' &&
			weight !== '' &&
			weight !== null &&
			Number(weight) > 0 &&
			height !== '' &&
			height !== null &&
			Number(height) > 0
		);
	}, [name, gender, birthDate, weight, height]);

	const isFormValid = useMemo(() => {
		return (
			isAllFieldsFilled &&
			nameValidation.isValid &&
			genderValidation.isValid &&
			birthDateValidation.isValid &&
			weightValidation.isValid &&
			heightValidation.isValid
		);
	}, [
		isAllFieldsFilled,
		nameValidation.isValid,
		genderValidation.isValid,
		birthDateValidation.isValid,
		weightValidation.isValid,
		heightValidation.isValid,
	]);

	// Обработчики
	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const error = validateImages([file]);
			setAvatarError(error);
			if (!error) {
				updateData('avatar', file);
				if (avatarPreview) {
					URL.revokeObjectURL(avatarPreview);
				}
				const preview = URL.createObjectURL(file);
				setAvatarPreview(preview);
			}
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawName = e.target.value;
		const cleanedName = sanitizeName(rawName);
		const formattedName = formatName(cleanedName);
		setName(formattedName);
	};

	const handleNameBlur = () => {
		setTouched((prev) => ({ ...prev, name: true }));
		if (nameValidation.isValid && name) {
			updateData('name', name);
		}
	};

	const handleGenderChange = (value: string) => {
		setGender(value);
		setTouched((prev) => ({ ...prev, gender: true }));
		updateData('gender', value);
	};

	const handleBirthDateChange = (date: number | string | null) => {
		setBirthDate(date);
		setTouched((prev) => ({ ...prev, birthDate: true }));
		if (date) {
			updateData('birthDate', date);
		}
	};

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setWeight(value);
		if (validateWeight(value).isValid) {
			updateData('weight', value);
		}
	};

	const handleWeightBlur = () => {
		setTouched((prev) => ({ ...prev, weight: true }));
		if (weightValidation.isValid && weight !== '') {
			updateData('weight', weight);
		}
	};

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setHeight(value);
		if (validateHeight(value).isValid) {
			updateData('height', value);
		}
	};

	const handleHeightBlur = () => {
		setTouched((prev) => ({ ...prev, height: true }));
		if (heightValidation.isValid && height !== '') {
			updateData('height', height);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setTouched({
			name: true,
			gender: true,
			birthDate: true,
			weight: true,
			height: true,
		});

		if (isFormValid) {
			// Финальное сохранение данных
			updateData('name', name);
			updateData('gender', gender);
			updateData('birthDate', birthDate);
			updateData('weight', weight);
			updateData('height', height);

			console.log('✅ Форма валидна — переходим на следующий шаг');
			onNext();
		} else {
			console.log('❌ Форма ещё не заполнена корректно');
		}
	};

	return (
		<div className={styles.container}>
			<div className={s.stepCounter}>
				<div className={s.stepIndicator}>Шаг 2 из 3</div>
				<div className={s.progressSteps}>
					<div className={`${s.stepDot} ${s.active}`} />
					<div className={`${s.stepDot} ${s.active}`} />
					<div className={s.stepDot} />
				</div>
			</div>

			<form onSubmit={handleSubmit} className={styles.form} noValidate>
				{/* Аватар */}
				<div className={styles.avatarSection}>
					<div
						className={styles.userPhotoAdd}
						onClick={handleAvatarClick}>
						{avatarPreview ? (
							<Avatar
								src={avatarPreview}
								size={isMobile ? 'medium' : 'large'}
								alt='Аватар'
							/>
						) : (
							<IconAdd />
						)}
					</div>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/jpeg,image/png,image/jpg'
						onChange={handleAvatarChange}
						style={{ display: 'none' }}
					/>
					{avatarError && (
						<p className={styles.avatarError}>{avatarError}</p>
					)}
				</div>

				{/* Имя */}
				<Input
					id='name'
					type='text'
					label='Имя'
					name='name'
					value={name}
					onChange={handleNameChange}
					onBlur={handleNameBlur}
					placeholder='Введите имя (только буквы)'
					required={true}
					error={
						showNameError ? nameValidation.errorMessage : undefined
					}
				/>

				{/* Пол */}
				<Select
					label='Выберите пол'
					options={[
						{ value: 'male', label: 'Мужской' },
						{ value: 'female', label: 'Женский' },
						{ value: 'other', label: 'Другой' },
					]}
					value={gender}
					onChange={handleGenderChange}
					placeholder='Выберите пол'
					error={
						showGenderError
							? genderValidation.errorMessage
							: undefined
					}
				/>

				{/* Дата рождения */}
				<DatePicker
					label='Дата рождения'
					date={birthDate}
					onChange={handleBirthDateChange}
					placeholder='дд.мм.гггг'
				/>

				{/* Вес и Рост */}
				<div className={styles.row}>
					<Input
						type='number'
						label='Вес (кг)'
						name='weight'
						value={weight}
						onChange={handleWeightChange}
						onBlur={handleWeightBlur}
						placeholder='70'
						min='0'
						step='0.1'
						className={styles.rowInput}
						error={
							showWeightError
								? weightValidation.errorMessage
								: undefined
						}
					/>

					<Input
						type='number'
						label='Рост (см)'
						name='height'
						value={height}
						onChange={handleHeightChange}
						onBlur={handleHeightBlur}
						placeholder='170'
						min='0'
						step='1'
						className={styles.rowInput}
						error={
							showHeightError
								? heightValidation.errorMessage
								: undefined
						}
					/>
				</div>

				{/* Кнопки */}
				<div className={styles.buttons}>
					<Button
						type='button'
						onClick={onPrev}
						variant='secondary'
						className={styles.backButton}>
						Назад
					</Button>
					<Button
						type='submit'
						variant='primary'
						className={styles.nextButton}
						disabled={!isFormValid}>
						Далее
					</Button>
				</div>
			</form>
		</div>
	);
};
