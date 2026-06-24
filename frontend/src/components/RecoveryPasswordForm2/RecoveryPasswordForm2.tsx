import React, { useCallback, useMemo, useState } from 'react';
import styles from './RecoveryPasswordForm2.module.scss';
import {
	validateConfirmPassword,
	validateNewPasswordWithOld,
	validateRecoveryCode,
} from '../../utils/validator';
import { Button, Input } from '@ui';

interface RecoveryPasswordForm2Props {
	email: string;
	onSubmit: (data: {
		code: string;
		newPassword: string;
		confirmPassword: string;
	}) => void;
	isLoading?: boolean;
	error?: string | null;
	onBack?: () => void;
}

export const RecoveryPasswordForm2: React.FC<RecoveryPasswordForm2Props> = ({
	email,
	onSubmit,
	isLoading = false,
	error = null,
	onBack,
}) => {
	const [formData, setFormData] = useState({
		code: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [touched, setTouched] = useState({
		code: false,
		newPassword: false,
		confirmPassword: false,
	});

	const codeValidation = useMemo(
		() => validateRecoveryCode(formData.code),
		[formData.code]
	);

	const newPasswordError = useMemo(() => {
		if (!touched.newPassword) return undefined;
		const res = validateNewPasswordWithOld(formData.newPassword);
		return res.isValid ? undefined : res.errorMessage;
	}, [formData.newPassword, touched.newPassword]);

	const confirmPasswordError = useMemo(() => {
		if (!touched.confirmPassword) return undefined;
		const res = validateConfirmPassword(
			formData.newPassword,
			formData.confirmPassword
		);
		return res.isValid ? undefined : res.errorMessage;
	}, [
		formData.newPassword,
		formData.confirmPassword,
		touched.confirmPassword,
	]);

	const isFormValid = useMemo(() => {
		return (
			codeValidation.isValid &&
			validateNewPasswordWithOld(formData.newPassword).isValid &&
			validateConfirmPassword(
				formData.newPassword,
				formData.confirmPassword
			).isValid
		);
	}, [codeValidation, formData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setTouched((prev) => ({ ...prev, [e.target.name]: true }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched({ code: true, newPassword: true, confirmPassword: true });

		if (isFormValid) {
			onSubmit(formData);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Восстановление пароля</h2>
			<p className={styles.subtitle}>
				На почту <strong>{email}</strong> был отправлен код
			</p>

			{error && <p className={styles.error}>{error}</p>}

			<form onSubmit={handleSubmit}>
				<Input
					type='text'
					name='code'
					label='Код подтверждения'
					value={formData.code}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder='000000'
					required
					maxLength={6}
					error={
						touched.code && !codeValidation.isValid
							? codeValidation.errorMessage
							: undefined
					}
				/>

				<Input
					type='password'
					name='newPassword'
					label='Новый пароль'
					value={formData.newPassword}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder='Новый пароль'
					required
					error={newPasswordError}
				/>

				<Input
					type='password'
					name='confirmPassword'
					label='Подтвердите пароль'
					value={formData.confirmPassword}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder='Повторите пароль'
					required
					error={confirmPasswordError}
				/>

				<div className={styles.buttons}>
					{onBack && (
						<Button
							type='button'
							variant='secondary'
							onClick={onBack}>
							Назад
						</Button>
					)}
					<Button
						type='submit'
						variant='primary'
						disabled={!isFormValid || isLoading}>
						{isLoading ? 'Сохранение...' : 'Сменить пароль'}
					</Button>
				</div>
			</form>
		</div>
	);
};
