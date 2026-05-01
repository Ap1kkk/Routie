import { useNavigate } from 'react-router-dom';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import {
	selectIsAuthenticated,
	selectLoginError,
} from '../../services/selectors/userSelectors';
import { RecoveryPasswordForm } from '@components';
import styles from './RecoveryPasswordPage.module.scss';

export const RecoveryPasswordPage = () => {
	const navigate = useNavigate();
	const oldPassword: string | undefined = 'qwrd2yks';

	const [formData, setFormData] = useState({
		newPassword: '',
		confirmPassword: '',
	});

	const error = useSelector(selectLoginError);
	const isAuthenticated = useSelector(selectIsAuthenticated);

	React.useEffect(() => {
		if (isAuthenticated) {
			const timer = setTimeout(() => {
				navigate('/');
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [isAuthenticated, navigate]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log('Пароль изменен:', {
			newPassword: formData.newPassword,
		});
	};

	const errorMessage = error
		? typeof error === 'object' && 'message' in error
			? error.message
			: typeof error === 'string'
			? error
			: 'Ошибка при смене пароля'
		: null;

	return (
		<section className={styles.container}>
			<RecoveryPasswordForm
				formData={formData}
				onChange={handleChange}
				onSubmit={handleSubmit}
				error={errorMessage}
				oldPassword={oldPassword}
			/>
		</section>
	);
};
