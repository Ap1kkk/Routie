import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@store';

import { RecoveryPasswordForm1 } from '@components';
import { RecoveryPasswordForm2 } from '@components';

import {
	confirmPasswordReset,
	requestPasswordReset,
} from '../../services/slices/authSlice/authSlice';

import styles from './RecoveryPasswordPage.module.scss';

export const RecoveryPasswordPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleRequestCode = async (userEmail: string) => {
		setIsLoading(true);
		setError(null);

		try {
			await dispatch(requestPasswordReset(userEmail)).unwrap();
			setEmail(userEmail);
			setStep(2);
		} catch (err: any) {
			setError(err?.message || 'Не удалось отправить код подтверждения');
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (data: {
		code: string;
		newPassword: string;
		confirmPassword: string;
	}) => {
		setIsLoading(true);
		setError(null);

		try {
			await dispatch(
				confirmPasswordReset({
					email,
					code: data.code,
					newPassword: data.newPassword,
				})
			).unwrap();

			alert('Пароль успешно изменён!');
			navigate('/login');
		} catch (err: any) {
			setError(err?.message || 'Не удалось сменить пароль');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className={styles.container}>
			{step === 1 && (
				<RecoveryPasswordForm1
					onSubmit={handleRequestCode}
					isLoading={isLoading}
					error={error}
				/>
			)}

			{step === 2 && (
				<RecoveryPasswordForm2
					email={email}
					onSubmit={handleResetPassword}
					isLoading={isLoading}
					error={error}
					onBack={() => setStep(1)}
				/>
			)}
		</section>
	);
};
