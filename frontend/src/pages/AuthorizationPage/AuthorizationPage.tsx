import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { AuthorizationForm } from '@components';
import { login, clearErrors } from '../../services/slices/authSlice/authSlice';
import { getDeviceId, getDeviceName } from '../../utils/UserAgent';
import {
	selectIsAuthenticated,
	selectIsLoading,
	selectAuthError,
} from '../../services/selectors/userSelectors';

import styles from './AuthorizationPage.module.scss';

export const AuthorizationPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const isLoading = useSelector(selectIsLoading);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const error = useSelector(selectAuthError);

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/routie', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Очищаем ошибку только если она была (при начале ввода после ошибки)
		if (error) {
			dispatch(clearErrors());
		}
	};

	const isFormValid = Boolean(formData.email && formData.password);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isFormValid) return;

		dispatch(
			login({
				email: formData.email,
				password: formData.password,
				deviceId: getDeviceId(),
				deviceName: getDeviceName(),
			})
		);
	};

	return (
		<section className={styles.container}>
			<AuthorizationForm
				formData={formData}
				onChange={handleChange}
				onSubmit={handleSubmit}
				isFormValid={isFormValid}
				isLoading={isLoading}
				error={error}
			/>
		</section>
	);
};

export default AuthorizationPage;
