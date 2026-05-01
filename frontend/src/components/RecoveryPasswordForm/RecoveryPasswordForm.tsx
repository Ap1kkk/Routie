import React, { useCallback, useMemo, useState } from 'react';
import styles from './RecoveryPasswordForm.module.scss';
import {
	validateConfirmPassword,
	validateNewPasswordWithOld,
	validateRecoveryPasswordForm,
} from '../../utils/validator';
import { Button, Input } from '@ui';

interface RecoveryPasswordFormProps {
	formData: {
		newPassword: string;
		confirmPassword: string;
	};
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
	error?: string | null;
	oldPassword?: string;
}

export const RecoveryPasswordForm: React.FC<RecoveryPasswordFormProps> = ({
	formData,
	onChange,
	onSubmit,
	error = null,
	oldPassword,
}) => {
	const [touched, setTouched] = useState({
		newPassword: false,
		confirmPassword: false,
	});

	const newPasswordError = useMemo(() => {
		if (!touched.newPassword) return undefined;
		if (!formData.newPassword) return 'Пароль обязателен';

		const validation = validateNewPasswordWithOld(
			formData.newPassword,
			oldPassword
		);
		return validation.isValid ? undefined : validation.errorMessage;
	}, [formData.newPassword, oldPassword, touched.newPassword]);

	const confirmPasswordError = useMemo(() => {
		if (!touched.confirmPassword) return undefined;
		if (!formData.confirmPassword) return 'Подтвердите пароль';

		const validation = validateConfirmPassword(
			formData.newPassword,
			formData.confirmPassword
		);
		return validation.isValid ? undefined : validation.errorMessage;
	}, [
		formData.newPassword,
		formData.confirmPassword,
		touched.confirmPassword,
	]);

	const isFormValid = useMemo(() => {
		if (!formData.newPassword || !formData.confirmPassword) return false;

		const validation = validateRecoveryPasswordForm(
			{
				newPassword: formData.newPassword,
				confirmPassword: formData.confirmPassword,
			},
			oldPassword
		);
		return validation.isValid;
	}, [formData, oldPassword]);

	const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
		setTouched((prev) => ({ ...prev, [e.target.name]: true }));
	}, []);

	const handleSubmit = useCallback(
		(e: React.ChangeEvent<HTMLFormElement>) => {
			e.preventDefault();

			setTouched({ newPassword: true, confirmPassword: true });

			if (isFormValid) {
				onSubmit(e);
			}
		},
		[isFormValid, onSubmit]
	);

	return (
		<div className={styles.container}>
			<div className={styles.errorContainer}>
				<h2 className={styles.title}>Восстановление пароля</h2>
				{error && <p className={styles.error}>{error}</p>}
			</div>

			<form className={styles.confirmationForm} onSubmit={handleSubmit}>
				<Input
					type='password'
					name='newPassword'
					label='Новый пароль'
					value={formData.newPassword}
					onChange={onChange}
					onBlur={handleBlur}
					required
					placeholder='Введите новый пароль'
					error={newPasswordError}
					autoComplete='new-password'
				/>

				<Input
					type='password'
					name='confirmPassword'
					label='Подтвердите пароль'
					value={formData.confirmPassword}
					onChange={onChange}
					onBlur={handleBlur}
					required
					placeholder='Подтвердите новый пароль'
					error={confirmPasswordError}
					autoComplete='new-password'
				/>

				<Button
					disabled={!isFormValid}
					type='submit'
					variant='primary'
					className={styles.buttonSubmitForm}>
					Сохранить пароль
				</Button>
			</form>
		</div>
	);
};
