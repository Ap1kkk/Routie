import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@store';

import { RegistrationForm1 } from '../../components/RegistrationForm1';
import { RegistrationForm2 } from '../../components/RegistrationForm2';
import { RegistrationForm3 } from '../../components/RegistrationForm3';

import { register } from '../../services/slices/authSlice/authSlice';
import { updateProfileApi, uploadAvatarApi } from '../../utils/api/ProfileApi';
import { getDeviceId, getDeviceName } from '../../utils/UserAgent';

import styles from './RegistrationPage.module.scss';

interface RegistrationData {
	email: string;
	password: string;
	username: string;
	name: string;
	gender: string;
	birthDate: string;
	weight: number;
	height: number;
	avatar: File | null;
	tags: string[];
}

const defaultData: RegistrationData = {
	email: '',
	password: '',
	username: '',
	name: '',
	gender: '',
	birthDate: '',
	weight: 0,
	height: 0,
	avatar: null,
	tags: [],
};

export const RegistrationPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [step, setStep] = useState<number>(1);
	const [formData, setFormData] = useState<RegistrationData>(defaultData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [visibleError, setVisibleError] = useState<string | null>(null);

	useEffect(() => {
		if (error) {
			setVisibleError(error);
			const timer = setTimeout(() => setVisibleError(null), 50000);
			return () => clearTimeout(timer);
		} else {
			setVisibleError(null);
		}
	}, [error]);

	const handleNextStep1 = async (data: {
		email: string;
		password: string;
		username: string;
	}) => {
		try {
			setIsLoading(true);
			setError(null);

			await dispatch(
				register({
					email: data.email,
					password: data.password,
					username: data.username,
					deviceId: getDeviceId(),
					deviceName: getDeviceName(),
				})
			).unwrap();

			setFormData((prev) => ({ ...prev, ...data }));
			setStep(2);
		} catch (err: any) {
			// ← Улучшенная обработка ошибки
			const errorMessage =
				typeof err === 'string'
					? err
					: err?.message ||
					  err?.error?.message ||
					  'Ошибка регистрации';

			setError(errorMessage);
			console.error('Registration error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateData = (key: string, value: unknown) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const handleNextStep2 = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const profileResult = await updateProfileApi({
				name: formData.name,
				dateOfBirth: formData.birthDate,
				gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
				city: 'Нижний Новгород',
				height: Number(formData.height),
				weight: Number(formData.weight),
			});

			if (!profileResult.success) {
				throw new Error(
					profileResult.error?.message || 'Ошибка обновления профиля'
				);
			}

			if (formData.avatar) {
				await uploadAvatarApi(formData.avatar).catch(() => {
					console.warn('Аватар не загрузился');
				});
			}

			setStep(3);
		} catch (err: any) {
			setError(err?.message || 'Ошибка обновления профиля');
		} finally {
			setIsLoading(false);
		}
	};

	const handleComplete = async (data: { tags: string[] }) => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await updateProfileApi({
				preferredTags: data.tags,
			});

			if (!result.success) {
				throw new Error(
					result.error?.message || 'Ошибка сохранения предпочтений'
				);
			}

			navigate('/routie');
		} catch (err: any) {
			setError(err?.message || 'Ошибка завершения регистрации');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		setStep((prev) => prev - 1);
	};

	return (
		<section className={styles.container}>

			{visibleError && (
				<div className={styles.error}>{visibleError}</div>
			)}

			{step === 1 && (
				<RegistrationForm1
					onNext={handleNextStep1}
					initialData={{
						email: formData.email,
						password: formData.password,
					}}
				/>
			)}

			{step === 2 && (
				<RegistrationForm2
					data={{
						name: formData.name,
						gender: formData.gender,
						birthDate: formData.birthDate,
						weight: formData.weight,
						height: formData.height,
						avatar: formData.avatar,
					}}
					updateData={handleUpdateData}
					onNext={handleNextStep2}
					onPrev={handleBack}
				/>
			)}

			{step === 3 && (
				<RegistrationForm3
					onComplete={handleComplete}
					onBack={handleBack}
					initialData={{ tags: formData.tags }}
				/>
			)}
		</section>
	);
};
