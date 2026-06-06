import { useEffect, useState } from 'react';
import styles from './EditProfilePage.module.scss';
import { EditProfileForm } from '@components';
import { useDispatch, useSelector } from '@store';
import {
	getMyProfile,
	updateProfile,
	uploadAvatar
} from '../../services/slices/profileSlice/profileSlice';
import { fetchAllTags } from '../../services/slices/tagsSlice/tagsSlice';
import { downloadFileApi } from '../../utils/api/FileApi';

export const EditProfilePage = () => {
	const dispatch = useDispatch();

	const profile = useSelector((state) => state.profile.myProfile);
	const profileLoading = useSelector((state) => state.profile.loading);
	const tags = useSelector((state) => state.tags.allTags || []);

	const availablePreferences = tags?.map((tag) => ({
		id: tag.id,
		label: tag.title
	})) ?? [];

	const [formData, setFormData] = useState({
		name: '',
		username: '',
		email: '',
		birthDate: null as string | null,
		weight: '',
		height: '',
		avatar: null as File | null,
		preferences: [] as string[],
	});

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	// Загрузка данных
	useEffect(() => {
		dispatch(getMyProfile());
		dispatch(fetchAllTags());
	}, [dispatch]);

	// Заполнение формы существующими данными
	useEffect(() => {
		if (!profile) return;

		setFormData({
			name: profile.name || '',
			username: profile.username || '',
			email: profile.email || '',
			birthDate: profile.dateOfBirth || null,
			weight: profile.weight !== null && profile.weight !== undefined
				? String(profile.weight)
				: '',
			height: profile.height !== null && profile.height !== undefined
				? String(profile.height)
				: '',
			avatar: null,
			preferences: profile.preferredTags?.map((tag) => tag.id) || [],
		});
	}, [profile]);

	// Загрузка аватара
	useEffect(() => {
		const loadAvatar = async () => {
			if (!profile?.avatar?.id) return;
			try {
				const avatar = await downloadFileApi(profile.avatar.id);
				setAvatarUrl(avatar);
			} catch (error) {
				console.error('Ошибка загрузки аватара', error);
			}
		};
		loadAvatar();
	}, [profile]);

	const handleUpdateData = (key: string, value: unknown) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		try {
			// Загрузка нового аватара
			if (formData.avatar) {
				await dispatch(uploadAvatar(formData.avatar)).unwrap();
			}

			// Обновление профиля
			await dispatch(
				updateProfile({
					name: formData.name || undefined,
					username: formData.username || undefined,
					email: formData.email || undefined,
					dateOfBirth: formData.birthDate || undefined,
					weight: formData.weight ? Number(formData.weight) : undefined,
					height: formData.height ? Number(formData.height) : undefined,
					preferredTags: formData.preferences.length > 0
						? formData.preferences
						: undefined,
				})
			).unwrap();

			// Обновляем данные профиля после сохранения
			await dispatch(getMyProfile()).unwrap();

			alert('Профиль успешно обновлён!');
		} catch (error: any) {
			console.error('Ошибка сохранения:', error);
			alert(error.message || 'Ошибка при сохранении профиля');
		}
	};

	if (profileLoading || !profile) {
		return <div className={styles.loading}>Загрузка профиля...</div>;
	}

	return (
		<section className={styles.container}>
			<EditProfileForm
				data={{
					...formData,
					avatarUrl
				}}
				updateData={handleUpdateData}
				availablePreferences={availablePreferences}
				onSubmit={handleSave}
			/>
		</section>
	);
};