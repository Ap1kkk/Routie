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
	const [error, setError] = useState<string | null>(null);
	const [visibleError, setVisibleError] = useState<string | null>(null);

	const availablePreferences = tags?.map((tag) => ({
		id: tag.id,
		label: tag.title
	})) ?? [];

	useEffect(() => {
		if (error) {
			setVisibleError(error);
			const timer = setTimeout(() => setVisibleError(null), 50000);
			return () => clearTimeout(timer);
		} else {
			setVisibleError(null);
		}
	}, [error]);

	useEffect(() => {
		dispatch(getMyProfile());
		dispatch(fetchAllTags());
	}, [dispatch]);

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
			setError(null);

			if (formData.avatar) {
				await dispatch(uploadAvatar(formData.avatar)).unwrap();
			}

			await dispatch(
				updateProfile({
					name: formData.name || undefined,
					username: formData.username || undefined,
					email: formData.email || undefined,
					dateOfBirth: formData.birthDate || undefined,
					weight: formData.weight
						? Number(formData.weight)
						: undefined,
					height: formData.height
						? Number(formData.height)
						: undefined,
					preferredTags:
						formData.preferences.length > 0
							? formData.preferences
							: undefined,
				})
			).unwrap();

			await dispatch(getMyProfile()).unwrap();

			// Успешное сохранение (опционально)
			// alert('Профиль успешно обновлён');
		} catch (err: any) {
			console.error('Ошибка сохранения профиля:', err);

			// ← Улучшенная обработка ошибки
			let errorMessage = 'Ошибка обновления профиля';

			if (typeof err === 'string') {
				errorMessage = err;
			} else if (err?.message) {
				errorMessage = err.message;
			} else if (err?.error?.message) {
				errorMessage = err.error.message;
			} else if (err?.payload) {
				errorMessage = err.payload;
			}

			setError(errorMessage);
		}
	};

	if (profileLoading || !profile) {
		return <div className={styles.loading}>Загрузка профиля...</div>;
	}

	return (
		<section className={styles.container}>
			{visibleError && (
				<div className={styles.error}>
					{visibleError}
				</div>
			)}

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