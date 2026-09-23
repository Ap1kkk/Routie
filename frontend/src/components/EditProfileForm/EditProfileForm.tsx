import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Avatar, Button, Input, Tag } from '@ui';
import styles from './EditProfileForm.module.scss';
import { DatePicker } from '../../ui/DataPicker';
import {
	formatName,
	sanitizeName,
	validateImages,
	validateName,
	validateWeight,
	validateHeight,
	validatePreferencesCount,
	validateAge,
	validateEmail,
} from '../../utils/validator';

interface PreferenceTag {
	id: string;
	label: string;
}

interface EditProfileFormProps {
	data: {
		name?: string;
		username?: string;
		email?: string;
		birthDate?: string | number | null;
		weight?: number | string;
		height?: number | string;
		avatar?: File | null;
		avatarUrl?: string | null;
		preferences?: string[] | number[];
	};
	updateData?: (key: string, value: unknown) => void;
	availablePreferences?: PreferenceTag[];
	onSubmit?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
	data,
	updateData,
	availablePreferences = [],
	onSubmit,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		data.avatar ? URL.createObjectURL(data.avatar) : data.avatarUrl || null
	);
	const [avatarError, setAvatarError] = useState<string | undefined>();

	const [name, setName] = useState(data.name || '');
	const [email, setEmail] = useState(data.email || '');
	const [username, setUsername] = useState(data.username || '');
	const [birthDate, setBirthDate] = useState<string | number | null>(
		data.birthDate || null
	);
	const [weight, setWeight] = useState<string>(
		data.weight !== undefined && data.weight !== null
			? String(data.weight)
			: ''
	);
	const [height, setHeight] = useState<string>(
		data.height !== undefined && data.height !== null
			? String(data.height)
			: ''
	);

	const [selectedPreferences, setSelectedPreferences] = useState<
		(string | number)[]
	>(data.preferences && data.preferences.length > 0 ? data.preferences : []);

	const [touched, setTouched] = useState({
		name: false,
		username: false,
		email: false,
		birthDate: false,
		weight: false,
		height: false,
		preferences: false,
	});

	useEffect(() => {
		setName(data.name || '');
		setUsername(data.username || '');
		setEmail(data.email || '');
		setBirthDate(data.birthDate || null);
		setWeight(
			data.weight !== undefined && data.weight !== null
				? String(data.weight)
				: ''
		);
		setHeight(
			data.height !== undefined && data.height !== null
				? String(data.height)
				: ''
		);
	}, [data]);

	useEffect(() => {
		if (data.preferences && data.preferences.length > 0) {
			setSelectedPreferences(data.preferences);
		}
	}, [data.preferences]);

	useEffect(() => {
		if (data.avatarUrl && !data.avatar) {
			setAvatarPreview(data.avatarUrl);
		}
	}, [data.avatarUrl, data.avatar]);

	useEffect(() => {
		return () => {
			if (avatarPreview && data.avatar) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview, data.avatar]);

	const nameValidation = useMemo(
		() =>
			!name
				? { isValid: false, errorMessage: 'Имя обязательно' }
				: validateName(name),
		[name]
	);

	const usernameValidation = useMemo(() => {
		if (!username.trim())
			return { isValid: false, errorMessage: 'Username обязателен' };
		if (username.length < 3)
			return { isValid: false, errorMessage: 'Минимум 3 символа' };
		return { isValid: true };
	}, [username]);

	const emailValidation = useMemo(
		() =>
			!email
				? { isValid: false, errorMessage: 'Email обязателен' }
				: validateEmail(email),
		[email]
	);

	const birthDateValidation = useMemo(() => {
		if (!birthDate)
			return { isValid: false, errorMessage: 'Укажите дату рождения' };
		const selectedDate = new Date(birthDate);
		if (isNaN(selectedDate.getTime()))
			return { isValid: false, errorMessage: 'Некорректная дата' };
		return validateAge(selectedDate);
	}, [birthDate]);

	const weightValidation = useMemo(() => {
		if (!weight) return { isValid: false, errorMessage: 'Вес обязателен' };
		return validateWeight(Number(weight));
	}, [weight]);

	const heightValidation = useMemo(() => {
		if (!height) return { isValid: false, errorMessage: 'Рост обязателен' };
		return validateHeight(Number(height));
	}, [height]);

	const preferencesValidation = useMemo(
		() => validatePreferencesCount(selectedPreferences.length),
		[selectedPreferences.length]
	);

	const showNameError = touched.name && !nameValidation.isValid;
	const showUsernameError = touched.username && !usernameValidation.isValid;
	const showEmailError = touched.email && !emailValidation.isValid;
	const showBirthDateError =
		touched.birthDate && !birthDateValidation.isValid;
	const showWeightError = touched.weight && !weightValidation.isValid;
	const showHeightError = touched.height && !heightValidation.isValid;
	const showPreferencesError =
		touched.preferences && !preferencesValidation.isValid;

	const isAllFieldsFilled = useMemo(
		() =>
			name.trim() !== '' &&
			username.trim() !== '' &&
			email.trim() !== '' &&
			birthDate !== null &&
			weight !== '' &&
			height !== '',
		[name, username, email, birthDate, weight, height]
	);

	const isFormValid = useMemo(
		() =>
			isAllFieldsFilled &&
			nameValidation.isValid &&
			usernameValidation.isValid &&
			emailValidation.isValid &&
			birthDateValidation.isValid &&
			weightValidation.isValid &&
			heightValidation.isValid &&
			preferencesValidation.isValid,
		[
			isAllFieldsFilled,
			nameValidation.isValid,
			usernameValidation.isValid,
			emailValidation.isValid,
			birthDateValidation.isValid,
			weightValidation.isValid,
			heightValidation.isValid,
			preferencesValidation.isValid,
		]
	);

	const handleAvatarClick = () => fileInputRef.current?.click();

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const error = validateImages([file]);
			setAvatarError(error);
			if (!error) {
				updateData?.('avatar', file);
				if (avatarPreview) URL.revokeObjectURL(avatarPreview);
				setAvatarPreview(URL.createObjectURL(file));
			}
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setName(formatName(sanitizeName(e.target.value)));
	const handleNameBlur = () => {
		setTouched((prev) => ({ ...prev, name: true }));
		if (nameValidation.isValid) updateData?.('name', name);
	};

	const handleEmailChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
		[]
	);
	const handleEmailBlur = useCallback(() => {
		setTouched((prev) => ({ ...prev, email: true }));
		if (emailValidation.isValid) updateData?.('email', email);
	}, [email, emailValidation.isValid, updateData]);

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setUsername(e.target.value);
	const handleUsernameBlur = () => {
		setTouched((prev) => ({ ...prev, username: true }));
		if (usernameValidation.isValid) updateData?.('username', username);
	};

	const handleBirthDateChange = (date: string | number | null) => {
		setBirthDate(date);
		setTouched((prev) => ({ ...prev, birthDate: true }));
		updateData?.('birthDate', date);
	};

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWeight(e.target.value);
		updateData?.('weight', Number(e.target.value));
	};
	const handleWeightBlur = () =>
		setTouched((prev) => ({ ...prev, weight: true }));

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHeight(e.target.value);
		updateData?.('height', Number(e.target.value));
	};
	const handleHeightBlur = () =>
		setTouched((prev) => ({ ...prev, height: true }));

	const handleTagClick = (id?: string | number) => {
		if (!id) return;
		setSelectedPreferences((prev) => {
			const isSelected = prev.includes(id);
			const newSelected = isSelected
				? prev.filter((item) => item !== id)
				: [...prev, id];
			updateData?.('preferences', newSelected);
			if (!touched.preferences && newSelected.length > 0)
				setTouched((prev) => ({ ...prev, preferences: true }));
			return newSelected;
		});
	};

	const handlePreferencesBlur = () => {
		if (!touched.preferences)
			setTouched((prev) => ({ ...prev, preferences: true }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched({
			name: true,
			username: true,
			email: true,
			birthDate: true,
			weight: true,
			height: true,
			preferences: true,
		});

		if (isFormValid) {
			updateData?.('name', name);
			updateData?.('username', username);
			updateData?.('email', email);
			updateData?.('birthDate', birthDate);
			updateData?.('weight', Number(weight));
			updateData?.('height', Number(height));
			updateData?.('preferences', selectedPreferences);
			onSubmit?.();
		}
	};

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.avatarSection}>
					<div
						className={styles.userPhotoAdd}
						onClick={handleAvatarClick}>
						<Avatar
							src={avatarPreview ?? ''}
							size='large'
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
						required
						error={
							showNameError
								? nameValidation.errorMessage
								: undefined
						}
					/>
					<Input
						id='username'
						type='text'
						label='Username'
						name='username'
						value={username}
						onChange={handleUsernameChange}
						onBlur={handleUsernameBlur}
						placeholder='your_username'
						required
						error={
							showUsernameError
								? usernameValidation.errorMessage
								: undefined
						}
					/>
					<DatePicker
						label='Дата рождения'
						date={birthDate}
						onChange={handleBirthDateChange}
						placeholder='дд.мм.гггг'
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
							wrap
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
