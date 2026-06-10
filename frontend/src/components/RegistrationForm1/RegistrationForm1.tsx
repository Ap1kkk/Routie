import React, { useCallback, useMemo, useState } from 'react';
import {
	validateConfirmPassword,
	validateEmail,
	validatePassword,
} from '../../utils/validator';
import { Button, Checkbox, Input } from '@ui';
import { Link } from 'react-router-dom';

import s from '../RegistrationForm/RegistrationForm.module.scss';
import styles from './RegistrationForm1.module.scss';

interface RegistrationForm1Props {
	onNext: (data: {
		email: string;
		password: string;
		username: string;
	}) => void;
	initialData?: { email: string; password: string; username?: string };
}

export const RegistrationForm1: React.FC<RegistrationForm1Props> = ({
	onNext,
	initialData,
}) => {
	const [email, setEmail] = useState(initialData?.email || '');
	const [username, setUsername] = useState(initialData?.username || '');
	const [password, setPassword] = useState(initialData?.password || '');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [agreements, setAgreements] = useState({
		terms: false,
		privacy: false,
	});

	const [touched, setTouched] = useState({
		email: false,
		username: false,
		password: false,
		confirmPassword: false,
	});

	const emailValidation = useMemo(() => {
		if (!email) {
			return { isValid: false, errorMessage: 'Email обязателен' };
		}
		return validateEmail(email);
	}, [email]);

	const usernameValidation = useMemo(() => {
		if (!username.trim()) {
			return { isValid: false, errorMessage: 'Username обязателен' };
		}
		if (username.length < 3) {
			return { isValid: false, errorMessage: 'Минимум 3 символа' };
		}
		return { isValid: true };
	}, [username]);

	const passwordValidation = useMemo(() => {
		if (!password) {
			return { isValid: false, errorMessage: 'Пароль обязателен' };
		}
		return validatePassword(password);
	}, [password]);

	const confirmPasswordValidation = useMemo(() => {
		if (!confirmPassword) {
			return {
				isValid: false,
				errorMessage: 'Подтверждение пароля обязательно',
			};
		}
		return validateConfirmPassword(password, confirmPassword);
	}, [password, confirmPassword]);

	const showEmailError = touched.email && !emailValidation.isValid;
	const showUsernameError = touched.username && !usernameValidation.isValid;
	const showPasswordError = touched.password && !passwordValidation.isValid;
	const showConfirmPasswordError =
		touched.confirmPassword && !confirmPasswordValidation.isValid;

	const handleAgreementChange =
		(key: 'terms' | 'privacy') =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setAgreements((prev) => ({
				...prev,
				[key]: e.target.checked,
			}));
		};

	const isAllFieldsFilled = useMemo(() => {
		return (
			email.trim() !== '' &&
			username.trim() !== '' &&
			password.trim() !== '' &&
			confirmPassword.trim() !== ''
		);
	}, [email, username, password, confirmPassword]);

	const isFormValid = useMemo(() => {
		return (
			isAllFieldsFilled &&
			emailValidation.isValid &&
			usernameValidation.isValid &&
			passwordValidation.isValid &&
			confirmPasswordValidation.isValid &&
			agreements.terms &&
			agreements.privacy
		);
	}, [
		isAllFieldsFilled,
		emailValidation.isValid,
		usernameValidation.isValid,
		passwordValidation.isValid,
		confirmPasswordValidation.isValid,
		agreements,
	]);

	const handleEmailChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setEmail(e.target.value);
		},
		[]
	);

	const handleUsernameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setUsername(e.target.value);
		},
		[]
	);

	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(e.target.value);
		},
		[]
	);

	const handleConfirmPasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setConfirmPassword(e.target.value);
		},
		[]
	);

	const handleEmailBlur = useCallback(() => {
		setTouched((prev) => ({ ...prev, email: true }));
	}, []);

	const handleUsernameBlur = useCallback(() => {
		setTouched((prev) => ({ ...prev, username: true }));
	}, []);

	const handlePasswordBlur = useCallback(() => {
		setTouched((prev) => ({ ...prev, password: true }));
	}, []);

	const handleConfirmPasswordBlur = useCallback(() => {
		setTouched((prev) => ({ ...prev, confirmPassword: true }));
	}, []);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();

			setTouched({
				email: true,
				username: true,
				password: true,
				confirmPassword: true,
			});

			if (isFormValid) {
				onNext({ email, password, username });
			}
		},
		[email, password, username, isFormValid, onNext]
	);

	return (
		<div className={styles.container}>
			<div className={s.stepCounter}>
				<div className={s.stepIndicator}>Шаг 1 из 3</div>
				<div className={s.progressSteps}>
					<div className={`${s.stepDot} ${s.active}`} />
					<div className={s.stepDot} />
					<div className={s.stepDot} />
				</div>
			</div>

			<form onSubmit={handleSubmit} className={styles.regForm} noValidate>
				<Input
					id='email'
					type='email'
					label='Email'
					name='email'
					value={email}
					onChange={handleEmailChange}
					onBlur={handleEmailBlur}
					placeholder='example@mail.com'
					required
					error={
						showEmailError
							? emailValidation.errorMessage
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

				<Input
					id='password'
					type='password'
					label='Пароль'
					name='password'
					value={password}
					onChange={handlePasswordChange}
					onBlur={handlePasswordBlur}
					placeholder='Минимум 8 символов'
					required
					error={
						showPasswordError
							? passwordValidation.errorMessage
							: undefined
					}
				/>

				<Input
					id='confirmPassword'
					type='password'
					label='Подтвердите пароль'
					name='confirmPassword'
					value={confirmPassword}
					onChange={handleConfirmPasswordChange}
					onBlur={handleConfirmPasswordBlur}
					placeholder='Введите пароль ещё раз'
					required
					error={
						showConfirmPasswordError
							? confirmPasswordValidation.errorMessage
							: undefined
					}
				/>

				<Checkbox
					checked={agreements.terms}
					onChange={handleAgreementChange('terms')}
					label={
						<div className={styles.containerAccess}>
							Я принимаю &nbsp;
							<Link
								to='/terms'
								target='_blank'
								className={styles.link}>
								Пользовательское соглашение
							</Link>
						</div>
					}
				/>

				<Checkbox
					checked={agreements.privacy}
					onChange={handleAgreementChange('privacy')}
					label={
						<div className={styles.containerAccess}>
							Я ознакомился с &nbsp;
							<Link
								to='/privacy'
								target='_blank'
								className={styles.link}>
								Политикой конфиденциальности
							</Link>
						</div>
					}
				/>

				<Button
					variant='primary'
					type='submit'
					className={styles.nextButton}
					disabled={!isFormValid}>
					Далее
				</Button>
			</form>

			<div className={styles.auth}>
				<p className={styles.authText}>Уже есть аккаунт?</p>
				<Link to='/login' className={styles.link}>
					Авторизоваться
				</Link>
			</div>
		</div>
	);
};
