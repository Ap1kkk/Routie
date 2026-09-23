import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@ui';
import {
	validateEmail,
	validatePassword,
	ValidationResult,
} from '../../utils/validator';

import styles from './AuthorizationForm.module.scss';

interface AuthorizationFormProps {
	formData: {
		email: string;
		password: string;
	};
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isFormValid: boolean;
	isLoading?: boolean;
	error?: string | null;
}

export const AuthorizationForm: React.FC<AuthorizationFormProps> = ({
	formData,
	onChange,
	onSubmit,
	isFormValid,
	isLoading = false,
	error = null,
}) => {
	const [displayErrors, setDisplayErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

	const [touched, setTouched] = useState<{
		email: boolean;
		password: boolean;
	}>({
		email: false,
		password: false,
	});

	const [visibleError, setVisibleError] = useState<string | null>(null);

	useEffect(() => {
		if (error) {
			setVisibleError(error);

			const timer = setTimeout(() => {
				setVisibleError(null);
			}, 3000);

			return () => clearTimeout(timer);
		} else {
			setVisibleError(null);
		}
	}, [error]);

	const emailValidation = useMemo(
		(): ValidationResult => validateEmail(formData.email),
		[formData.email]
	);
	const passwordValidation = useMemo(
		(): ValidationResult => validatePassword(formData.password),
		[formData.password]
	);

	const isClientFormValid = useMemo(() => {
		return emailValidation.isValid && passwordValidation.isValid;
	}, [emailValidation.isValid, passwordValidation.isValid]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			onChange(e);

			if (touched[name as keyof typeof touched]) {
				setDisplayErrors((prev) => ({ ...prev, [name]: undefined }));
			}
		},
		[onChange, touched]
	);

	const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTouched((prev) => ({ ...prev, [name]: true }));

		if (name === 'email') {
			const validation = validateEmail(value);
			setDisplayErrors((prev) => ({
				...prev,
				email: validation.isValid ? undefined : validation.errorMessage,
			}));
		} else if (name === 'password') {
			const validation = validatePassword(value);
			setDisplayErrors((prev) => ({
				...prev,
				password: validation.isValid
					? undefined
					: validation.errorMessage,
			}));
		}
	}, []);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			setTouched({ email: true, password: true });

			const emailResult = validateEmail(formData.email);
			const passwordResult = validatePassword(formData.password);

			setDisplayErrors({
				email: emailResult.isValid
					? undefined
					: emailResult.errorMessage,
				password: passwordResult.isValid
					? undefined
					: passwordResult.errorMessage,
			});

			if (emailResult.isValid && passwordResult.isValid) {
				onSubmit(e);
			}
		},
		[onSubmit, formData.email, formData.password]
	);

	const isDisabled = useMemo(() => {
		return !isFormValid || isLoading || !isClientFormValid;
	}, [isFormValid, isLoading, isClientFormValid]);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Вход в профиль</h2>

			{visibleError && (
				<div className={styles.error}>{visibleError}</div>
			)}

			<form className={styles.authForm} onSubmit={handleSubmit}>
				<Input
					type='email'
					name='email'
					label='Email'
					value={formData.email}
					onChange={handleChange}
					onBlur={handleBlur}
					required
					placeholder='example@mail.com'
					error={displayErrors.email}
				/>

				<Input
					type='password'
					name='password'
					label='Пароль'
					value={formData.password}
					onChange={handleChange}
					onBlur={handleBlur}
					required
					placeholder='Введите пароль'
					error={displayErrors.password}
				/>

				<Button
					children={isLoading ? 'Вход...' : 'Войти'}
					disabled={isDisabled}
					type='submit'
					variant='primary'
					className={styles.buttonSubmitForm}
				/>
			</form>

			<div className={styles.links}>
				<Link to='/recovery-page' className={styles.link}>
					Забыли пароль?
				</Link>

				<div className={styles.register}>
					<p className={styles.registerText}>Нет аккаунта?</p>
					<Link to='/registration' className={styles.link}>
						Зарегистрироваться
					</Link>
				</div>
			</div>
		</div>
	);
};
