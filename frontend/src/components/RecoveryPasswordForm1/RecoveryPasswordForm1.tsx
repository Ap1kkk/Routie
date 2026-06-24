import React, { useState, useMemo } from 'react';
import { Button, Input } from '@ui';
import { validateEmail } from '../../utils/validator';
import styles from './RecoveryPasswordForm1.module.scss';

interface RecoveryPasswordForm1Props {
	onSubmit: (email: string) => void;
	isLoading?: boolean;
	error?: string | null;
}

export const RecoveryPasswordForm1: React.FC<RecoveryPasswordForm1Props> = ({
	onSubmit,
	isLoading = false,
	error = null,
}) => {
	const [email, setEmail] = useState('');
	const [touched, setTouched] = useState(false);

	const validation = useMemo(() => validateEmail(email), [email]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched(true);

		if (validation.isValid && !isLoading) {
			onSubmit(email.trim());
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Восстановление пароля</h2>
			<p className={styles.subtitle}>
				Введите email, привязанный к вашему аккаунту
			</p>

			{error && <p className={styles.error}>{error}</p>}

			<form onSubmit={handleSubmit}>
				<Input
					type='email'
					label='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onBlur={() => setTouched(true)}
					placeholder='example@mail.com'
					required
					error={
						touched && !validation.isValid
							? validation.errorMessage
							: undefined
					}
				/>

				<Button
					type='submit'
					variant='primary'
					disabled={!validation.isValid || isLoading}
					className={styles.button}>
					{isLoading ? 'Отправка кода...' : 'Отправить код'}
				</Button>
			</form>

			<div className={styles.links}>
				<a href='/login' className={styles.link}>
					Вернуться ко входу
				</a>
			</div>
		</div>
	);
};
