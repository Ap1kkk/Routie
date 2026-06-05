import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './RegistrationPage.module.scss';

import { RegistrationForm1 } from '../../components/RegistrationForm1';
import { RegistrationForm2 } from '../../components/RegistrationForm2';

import { registerUserApi } from '../../utils/api/AuthApi';
import { updateProfileApi, uploadAvatarApi } from '../../utils/api/ProfileApi';
import { RegistrationForm3 } from '../../components/RegistrationForm3';

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

	const [step, setStep] = useState<number>(1);
	const [formData, setFormData] = useState<RegistrationData>(defaultData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleNextStep1 = async (data: {
		email: string;
		password: string;
		username: string;
	}) => {
		setIsLoading(true);
		setError(null);

		const result = await registerUserApi({
			email: data.email,
			password: data.password,
			username: data.username,
			name: 'temp_name',
		});

		setIsLoading(false);

		if (!result.success) {
			setError(result.error?.message || 'Ошибка регистрации');
			return;
		}

		setFormData((prev) => ({ ...prev, ...data }));
		setStep(2);
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
			});

			if (!profileResult.success) {
				throw new Error(profileResult.error?.message);
			}

			if (formData.avatar) {
				const avatarResult = await uploadAvatarApi(formData.avatar);

				if (!avatarResult.success) {
					throw new Error(avatarResult.error?.message);
				}

				console.log('✅ Аватар загружен:', avatarResult.data);
			}

			setStep(3);
		} catch (err: any) {
			console.error('❌ Ошибка:', err);
			setError(err.message || 'Ошибка обновления профиля');
		} finally {
			setIsLoading(false);
		}
	};

	const handleComplete = async (data: { tags: string[] }) => {
		setIsLoading(true);
		setError(null);

		const result = await updateProfileApi({
			preferredTags: data.tags,
		});

		setIsLoading(false);

		if (!result.success) {
			setError(result.error?.message || 'Ошибка сохранения предпочтений');
			return;
		}

		navigate('/routie');
	};

	const handleBack = () => {
		setStep((prev) => prev - 1);
	};

	return (
		<section className={styles.container}>
			{isLoading && <div>Загрузка...</div>}
			{error && <div className={styles.error}>Ошибка: {error}</div>}

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
