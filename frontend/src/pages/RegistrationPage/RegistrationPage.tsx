// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from '@store';
//
// import styles from './RegistrationPage.module.scss';
// import { RootState } from '@store';
// import { register } from '../../services/slices/userSlice/userSlice';
// import { RegistrationForm1 } from '../../components/RegistrationForm1';
// import { RegistrationForm2 } from '../../components/RegistrationForm2';
// import { RegistrationForm3 } from '../../components/RegistrationForm3';
//
// interface RegistrationData {
// 	email: string;
// 	password: string;
// 	avatar: File | null;
// 	name: string;
// 	gender: string;
// 	birthDate: string;
// 	weight: number;
// 	height: number;
// 	tags: string[];
// }
//
// const defaultData: RegistrationData = {
// 	email: '',
// 	password: '',
// 	avatar: null,
// 	name: '',
// 	gender: '',
// 	birthDate: '',
// 	weight: 0,
// 	height: 0,
// 	tags: [],
// };
//
// export const RegistrationPage: React.FC = () => {
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();
//
// 	const { isLoading, registerError } = useSelector(
// 		(state: RootState) => state.user
// 	);
//
// 	const [step, setStep] = useState<number>(1);
// 	const [formData, setFormData] = useState<RegistrationData>(defaultData);
// 	const [userId, setUserId] = useState<string | null>(null); // сохраняем id после регистрации
//
// 	// ==================== ШАГ 1: Регистрация (email + password) ====================
// 	const handleNextStep1 = async (data: {
// 		email: string;
// 		password: string;
// 	}) => {
// 		console.log('=== ШАГ 1: Отправка на регистрацию ===');
// 		console.log('Данные:', data);
//
// 		const result = await dispatch(
// 			register({
// 				email: data.email,
// 				password: data.password,
// 				username: data.email.split('@')[0], // временно
// 			} as any)
// 		).unwrap();
//
// 		if (result?.id) {
// 			setUserId(result.id);
// 			setFormData((prev) => ({ ...prev, ...data }));
// 			setStep(2);
// 		}
// 	};
//
// 	// ==================== ШАГ 2: Обновление профиля ====================
// 	const handleUpdateData = (key: string, value: unknown) => {
// 		setFormData((prev) => ({ ...prev, [key]: value }));
// 	};
//
// 	const handleNextStep2 = async () => {
// 		if (!userId) return;
//
// 		const updateData = {
// 			name: formData.name,
// 			gender: formData.gender,
// 			birthday: formData.birthDate,
// 			weight: Number(formData.weight),
// 			height: Number(formData.height),
// 			// avatar обработаем отдельно при необходимости
// 		};
//
// 		console.log('=== ШАГ 2: Обновление профиля ===');
// 		console.log('Отправляемые данные:', updateData);
//
// 		try {
// 			await dispatch(updateUser(updateData as any)).unwrap();
// 			setStep(3);
// 		} catch (err) {
// 			console.error('Ошибка обновления профиля:', err);
// 		}
// 	};
//
// 	// ==================== ШАГ 3: Сохранение тегов ====================
// 	const handleComplete = async (data: { tags: string[] }) => {
// 		const completeData = { ...formData, ...data };
// 		console.log('=== ШАГ 3: Завершение регистрации ===');
// 		console.log('Финальные данные:', completeData);
//
// 		// Обновляем теги пользователя
// 		if (userId && completeData.tags.length > 0) {
// 			console.log('Обновляем теги пользователя:', completeData.tags);
//
// 			// Если есть отдельный API для тегов — используем его
// 			// await updateUserTags(userId, completeData.tags);
//
// 			// Пока используем updateUser (если сервер поддерживает)
// 			await dispatch(
// 				updateUser({ tags: completeData.tags } as any)
// 			).unwrap();
// 		}
//
// 		console.log('✅ Регистрация успешно завершена!');
// 		navigate('/routie');
// 	};
//
// 	const handleBack = () => {
// 		setStep((prev) => prev - 1);
// 	};
//
// 	return (
// 		<section className={styles.container}>
// 			{isLoading && <div>Загрузка...</div>}
// 			{registerError && (
// 				<div className={styles.error}>Ошибка: {registerError}</div>
// 			)}
//
// 			{step === 1 && (
// 				<RegistrationForm1
// 					onNext={handleNextStep1}
// 					initialData={{
// 						email: formData.email,
// 						password: formData.password,
// 					}}
// 				/>
// 			)}
//
// 			{step === 2 && (
// 				<RegistrationForm2
// 					data={{
// 						name: formData.name,
// 						gender: formData.gender,
// 						birthDate: formData.birthDate,
// 						weight: formData.weight,
// 						height: formData.height,
// 						avatar: formData.avatar,
// 					}}
// 					updateData={handleUpdateData}
// 					onNext={handleNextStep2}
// 					onPrev={handleBack}
// 				/>
// 			)}
//
// 			{step === 3 && (
// 				<RegistrationForm3
// 					onComplete={handleComplete}
// 					onBack={handleBack}
// 					initialData={{ tags: formData.tags }}
// 				/>
// 			)}
// 		</section>
// 	);
// };
