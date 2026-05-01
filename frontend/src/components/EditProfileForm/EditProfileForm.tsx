import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Input, Tag } from '@ui';
import { Tags } from '../../types/tags';

import styles from './EditProfileForm.module.scss';

import {
	formatName,
	sanitizeName,
	validateHeight,
	validateImages,
	validateName,
	validateWeight,
	validatePreferencesCount,
} from '../../utils/validator';

interface EditProfileFormProps {
	data: {
		name: string;
		weight: number | string;
		height: number | string;
		avatar?: File | null;
		avatarUrl?: string | null;
		preferences?: string[] | number[];
	};
	updateData?: (key: string, value: unknown) => void;
	availablePreferences?: Tags[];
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
	data,
	updateData,
	availablePreferences = [],
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		data.avatar ? URL.createObjectURL(data.avatar) : null
	);
	const [avatarError, setAvatarError] = useState<string | undefined>();
	const [name, setName] = useState(data.name || '');
	const [weight, setWeight] = useState<string | number>(data.weight || '');
	const [height, setHeight] = useState<string | number>(data.height || '');

	const [selectedPreferences, setSelectedPreferences] = useState<
		(string | number)[]
	>(() => {
		if (data.preferences && data.preferences.length > 0) {
			return data.preferences;
		}
		return [];
	});

	const [touched, setTouched] = useState({
		name: false,
		weight: false,
		height: false,
		preferences: false,
	});

	useEffect(() => {
		if (data.preferences && data.preferences.length > 0) {
			setSelectedPreferences(data.preferences);
		}
	}, [data.preferences]);

	useEffect(() => {
		return () => {
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview]);

	const nameValidation = useMemo(() => {
		if (!name) {
			return { isValid: false, errorMessage: 'Имя обязательно' };
		}
		return validateName(name);
	}, [name]);

	const weightValidation = useMemo(() => {
		if (!weight && weight !== 0) {
			return { isValid: false, errorMessage: 'Вес обязателен' };
		}
		return validateWeight(weight);
	}, [weight]);

	const heightValidation = useMemo(() => {
		if (!height && height !== 0) {
			return { isValid: false, errorMessage: 'Рост обязателен' };
		}
		return validateHeight(height);
	}, [height]);

	const preferencesValidation = useMemo(() => {
		return validatePreferencesCount(selectedPreferences.length);
	}, [selectedPreferences.length]);

	const showNameError = touched.name && !nameValidation.isValid;
	const showWeightError = touched.weight && !weightValidation.isValid;
	const showHeightError = touched.height && !heightValidation.isValid;
	const showPreferencesError =
		touched.preferences && !preferencesValidation.isValid;

	const isAllFieldsFilled = useMemo(() => {
		return (
			name.trim() !== '' &&
			weight !== '' &&
			weight !== null &&
			height !== '' &&
			height !== null
		);
	}, [name, weight, height]);

	const isFormValid = useMemo(() => {
		return (
			isAllFieldsFilled &&
			nameValidation.isValid &&
			weightValidation.isValid &&
			heightValidation.isValid &&
			preferencesValidation.isValid
		);
	}, [
		isAllFieldsFilled,
		nameValidation.isValid,
		weightValidation.isValid,
		heightValidation.isValid,
		preferencesValidation.isValid,
	]);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const error = validateImages([file]);
			setAvatarError(error);
			if (!error) {
				updateData?.('avatar', file);
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
			updateData?.('name', name);
		}
	};

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setWeight(value);
	};

	const handleWeightBlur = () => {
		setTouched((prev) => ({ ...prev, weight: true }));
		if (weightValidation.isValid && weight !== '') {
			updateData?.('weight', weight);
		}
	};

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setHeight(value);
	};

	const handleHeightBlur = () => {
		setTouched((prev) => ({ ...prev, height: true }));
		if (heightValidation.isValid && height !== '') {
			updateData?.('height', height);
		}
	};

	const handleTagClick = (id?: string | number) => {
		if (!id) return;

		setSelectedPreferences((prev) => {
			const isSelected = prev.includes(id);
			let newSelected;

			if (isSelected) {
				newSelected = prev.filter((item) => item !== id);
			} else {
				newSelected = [...prev, id];
			}

			updateData?.('preferences', newSelected);

			if (!touched.preferences && newSelected.length > 0) {
				setTouched((prev) => ({ ...prev, preferences: true }));
			}

			return newSelected;
		});
	};

	const handlePreferencesBlur = () => {
		if (!touched.preferences) {
			setTouched((prev) => ({ ...prev, preferences: true }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setTouched({
			name: true,
			weight: true,
			height: true,
			preferences: true,
		});

		console.log('Form validation:', {
			isFormValid,
			name: { value: name, isValid: nameValidation.isValid },
			weight: { value: weight, isValid: weightValidation.isValid },
			height: { value: height, isValid: heightValidation.isValid },
			preferences: {
				count: selectedPreferences.length,
				ids: selectedPreferences,
				isValid: preferencesValidation.isValid,
				error: preferencesValidation.errorMessage,
			},
		});

		if (isFormValid) {
			updateData?.('name', name);
			updateData?.('weight', weight);
			updateData?.('height', height);
			updateData?.('preferences', selectedPreferences);

			console.log('Form is valid');
		} else {
			console.log('Form is invalid');
		}
	};

	return (
		<div className={styles.container}>
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.avatarSection}>
					<div
						className={styles.userPhotoAdd}
						onClick={handleAvatarClick}>
						<Avatar
							src={avatarPreview ?? ''}
							size={'large'}
							alt='Аватар'
						/>
					</div>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/jpeg,image/png,image/jpg'
						style={{ display: 'none' }}
						onChange={handleAvatarChange}
					/>
					{avatarError && (
						<p className={styles.avatarError}>{avatarError}</p>
					)}
				</div>

				<div className={styles.inputGroup}>
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
							showNameError
								? nameValidation.errorMessage
								: undefined
						}
					/>

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
						error={
							showHeightError
								? heightValidation.errorMessage
								: undefined
						}
					/>
				</div>

				{availablePreferences.length > 0 && (
					<div
						className={styles.preferencesSection}
						onBlur={handlePreferencesBlur}>
						<h3 className={styles.preferencesLabel}>
							Предпочтения
						</h3>
						<Tag
							items={availablePreferences}
							variant='selectable'
							selectedIds={selectedPreferences}
							onTagClick={handleTagClick}
							wrap={true}
						/>
						{showPreferencesError && (
							<p className={styles.errorText}>
								{preferencesValidation.errorMessage}
							</p>
						)}
					</div>
				)}

				<Button
					children='Подтвердить'
					type='submit'
					variant='primary'
				/>
			</form>
		</div>
	);
};
