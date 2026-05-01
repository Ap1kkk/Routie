// ========== КОНСТАНТЫ ==========
/** Минимальная длина пароля */
export const MIN_PASSWORD_LENGTH = 8;
/** Максимальная длина пароля */
export const MAX_PASSWORD_LENGTH = 50;
/** Минимальная длина имени */
export const MIN_NAME_LENGTH = 2;
/** Максимальная длина имени */
export const MAX_NAME_LENGTH = 30;
/** Минимальный возраст пользователя */
export const MIN_AGE = 13;
/** Максимальный возраст пользователя */
export const MAX_AGE = 100;
/** Максимальный размер изображения в МБ */
export const MAX_IMAGE_SIZE_MB = 2;
/** Допустимые типы изображений */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const;
/** Минимальный вес (кг) */
export const MIN_WEIGHT = 20;
/** Максимальный вес (кг) */
export const MAX_WEIGHT = 300;
/** Минимальный рост (см) */
export const MIN_HEIGHT = 50;
/** Максимальный рост (см) */
export const MAX_HEIGHT = 250;
/** Минимальное количество предпочтений */
export const MIN_PREFERENCES_COUNT = 3;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
/** Проверка на пустую строку */
const isEmpty = (value: string): boolean => !value || value.trim() === '';

/** Базовый объект успешной валидации */
const valid = (): ValidationResult => ({ isValid: true });

/** Базовый объект ошибки */
const invalid = (errorMessage: string): ValidationResult => ({
	isValid: false,
	errorMessage,
});

// ========== ТИПЫ ==========
export interface ValidationResult {
	isValid: boolean;
	errorMessage?: string;
}

export interface LoginFormData {
	email: string;
	password: string;
}

export interface RegisterFormData {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	birthDate?: Date;
}

export interface RecoveryPasswordFormData {
	newPassword: string;
	confirmPassword: string;
}

export interface RecoveryPasswordValidationResult extends ValidationResult {
	isSameAsOldPassword?: boolean;
}

// ========== ОСНОВНЫЕ ВАЛИДАТОРЫ ==========
/** Валидация email */
export const validateEmail = (email: string): ValidationResult => {
	if (isEmpty(email)) return invalid('Email обязателен для заполнения');

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email)) return invalid('Введите корректный email');

	return valid();
};

/** Валидация пароля */
export const validatePassword = (password: string): ValidationResult => {
	if (isEmpty(password)) return invalid('Пароль обязателен для заполнения');
	if (password.length < MIN_PASSWORD_LENGTH)
		return invalid(
			`Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`
		);
	if (password.length > MAX_PASSWORD_LENGTH)
		return invalid(
			`Пароль не должен превышать ${MAX_PASSWORD_LENGTH} символов`
		);
	if (!/\d/.test(password))
		return invalid('Пароль должен содержать хотя бы одну цифру');

	const allowedCharsRegex =
		/^[A-Za-zА-Яа-я0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
	if (!allowedCharsRegex.test(password))
		return invalid('Пароль содержит недопустимые символы');

	return valid();
};

/** Валидация подтверждения пароля */
export const validateConfirmPassword = (
	password: string,
	confirmPassword: string
): ValidationResult => {
	if (isEmpty(confirmPassword))
		return invalid('Подтверждение пароля обязательно');
	if (password !== confirmPassword) return invalid('Пароли не совпадают');
	return valid();
};

/** Очистка имени: удаляет все, кроме букв кириллицы */
export const sanitizeName = (name: string): string => {
	if (!name) return '';
	return name.replace(/[^а-яА-ЯёЁ]/g, '');
};

/** Форматирование имени: первая буква заглавная, остальные строчные */
export const formatName = (name: string): string => {
	const sanitized = sanitizeName(name);
	if (!sanitized) return '';
	return sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
};

/** Валидация имени (только кириллица, без пробелов и дефисов) */
export const validateName = (name: string): ValidationResult => {
	if (isEmpty(name)) return invalid('Имя обязательно для заполнения');

	const cleanedName = sanitizeName(name);
	if (!cleanedName)
		return invalid('Имя должно содержать только буквы кириллицы');
	if (cleanedName.length < MIN_NAME_LENGTH)
		return invalid(`Имя должно содержать минимум ${MIN_NAME_LENGTH} буквы`);
	if (cleanedName.length > MAX_NAME_LENGTH)
		return invalid(`Имя не должно превышать ${MAX_NAME_LENGTH} букв`);

	return valid();
};

/** Валидация возраста */
export const validateAge = (
	birthDate: Date,
	minAge: number = MIN_AGE,
	maxAge: number = MAX_AGE
): ValidationResult => {
	if (!birthDate) return invalid('Дата рождения обязательна');

	const today = new Date();
	const birthDateObj = new Date(birthDate);

	if (isNaN(birthDateObj.getTime()))
		return invalid('Некорректная дата рождения');
	if (birthDateObj > today)
		return invalid('Дата рождения не может быть в будущем');

	// Расчет возраста
	let age = today.getFullYear() - birthDateObj.getFullYear();
	const monthDiff = today.getMonth() - birthDateObj.getMonth();
	const dayDiff = today.getDate() - birthDateObj.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

	if (age < minAge) return invalid(`Вам должно быть минимум ${minAge} лет`);
	if (age > maxAge)
		return invalid(`Возраст не может превышать ${maxAge} лет`);

	return valid();
};

/** Расчет возраста из даты рождения */
export const calculateAge = (birthDate: Date): number | null => {
	if (!birthDate) return null;

	const today = new Date();
	const birthDateObj = new Date(birthDate);

	if (isNaN(birthDateObj.getTime())) return null;

	let age = today.getFullYear() - birthDateObj.getFullYear();
	const monthDiff = today.getMonth() - birthDateObj.getMonth();
	const dayDiff = today.getDate() - birthDateObj.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

	return age;
};

/** Валидация веса (кг) */
export const validateWeight = (weight: number | string): ValidationResult => {
	const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;

	if (isNaN(numWeight)) return invalid('Вес должен быть числом');
	if (numWeight < MIN_WEIGHT)
		return invalid(`Вес не может быть меньше ${MIN_WEIGHT} кг`);
	if (numWeight > MAX_WEIGHT)
		return invalid(`Вес не может быть больше ${MAX_WEIGHT} кг`);

	return valid();
};

/** Валидация роста (см) */
export const validateHeight = (height: number | string): ValidationResult => {
	const numHeight = typeof height === 'string' ? parseFloat(height) : height;

	if (isNaN(numHeight)) return invalid('Рост должен быть числом');
	if (numHeight < MIN_HEIGHT)
		return invalid(`Рост не может быть меньше ${MIN_HEIGHT} см`);
	if (numHeight > MAX_HEIGHT)
		return invalid(`Рост не может быть больше ${MAX_HEIGHT} см`);

	return valid();
};

/** Комплексная валидация формы авторизации */
export const validateLoginForm = (data: LoginFormData): ValidationResult => {
	const emailResult = validateEmail(data.email);
	if (!emailResult.isValid) return emailResult;

	return validatePassword(data.password);
};

/** Комплексная валидация формы регистрации */
export const validateRegisterForm = (
	data: RegisterFormData,
	minAge: number = MIN_AGE
): ValidationResult => {
	const validations = [
		validateEmail(data.email),
		validatePassword(data.password),
		validateConfirmPassword(data.password, data.confirmPassword),
		validateName(data.name),
	];

	for (const result of validations) {
		if (!result.isValid) return result;
	}

	if (data.birthDate) {
		const ageResult = validateAge(data.birthDate, minAge);
		if (!ageResult.isValid) return ageResult;
	}

	return valid();
};

/** Валидация изображений (тип и размер) */
export const validateImages = (files: File[]): string | undefined => {
	for (const file of files) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
			return `Файл "${file.name}" должен быть в формате JPEG или PNG`;
		}
		if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
			return `Файл "${file.name}" не должен превышать ${MAX_IMAGE_SIZE_MB} МБ`;
		}
	}
	return undefined;
};

/** Валидация нового пароля с проверкой на отличие от старого */
export const validateNewPasswordWithOld = (
	newPassword: string,
	oldPassword?: string
): RecoveryPasswordValidationResult => {
	const passwordValidation = validatePassword(newPassword);
	if (!passwordValidation.isValid) {
		return passwordValidation;
	}

	if (oldPassword && newPassword === oldPassword) {
		return invalid('Новый пароль должен отличаться от текущего');
	}

	return valid();
};

/** Комплексная валидация формы восстановления пароля */
export const validateRecoveryPasswordForm = (
	data: RecoveryPasswordFormData,
	oldPassword?: string
): RecoveryPasswordValidationResult => {
	const newPasswordResult = validateNewPasswordWithOld(
		data.newPassword,
		oldPassword
	);
	if (!newPasswordResult.isValid) {
		return newPasswordResult;
	}

	const confirmResult = validateConfirmPassword(
		data.newPassword,
		data.confirmPassword
	);
	if (!confirmResult.isValid) {
		return confirmResult;
	}

	return valid();
};

export const validatePreferencesCount = (
	selectedCount: number
): ValidationResult => {
	if (selectedCount < MIN_PREFERENCES_COUNT)
		return invalid(
			`Минимальное количество предпочтений: ${MIN_PREFERENCES_COUNT}`
		);
	return valid();
};
