import { useEffect, useState } from 'react';
import styles from './EditProfilePage.module.scss';
import { EditProfileForm } from '@components';
import { useDispatch, useSelector } from '@store';
import { getMyProfile, updateProfile, uploadAvatar } from '../../services/slices/profileSlice/profileSlice';
import { fetchAllTags } from '../../services/slices/tagsSlice/tagsSlice';
import { downloadFileApi } from '../../utils/api/FileApi';

export const EditProfilePage = () => {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile.myProfile);
	const profileLoading = useSelector((state) => state.profile.loading);
	const tags = useSelector((state) => state.tags.allTags || []);

	const availablePreferences =
		tags?.map((tag) => ({ id: tag.id, label: tag.title })) ?? [];

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

	// Load profile and tags
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
			weight: '',
			height: '',
			avatar: null,
			preferences: profile.preferredTags?.map((tag) => tag.id) || [],
		});
	}, [profile]);

	// Load avatar from server
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
		if (!profile) return;

		try {
			// Загружаем новый аватар
			if (formData.avatar) {
				await dispatch(uploadAvatar(formData.avatar)).unwrap();
			}

			await dispatch(
				updateProfile({
					name: formData.name,
					username: formData.username,
					email: formData.email,
					dateOfBirth: formData.birthDate as string,
					gender: profile.gender,
					weight: profile.weight,
					height: profile.height,
					city: profile.city,
					preferredTags: formData.preferences,
				})
			).unwrap();

			await dispatch(getMyProfile()).unwrap();
		} catch (error) {
			console.error(error);
		}
	};

	if (profileLoading || !profile) return <div>Загрузка...</div>;

	return (
		<section className={styles.container}>
			<EditProfileForm
				data={{ ...formData, avatarUrl }}
				updateData={handleUpdateData}
				availablePreferences={availablePreferences}
				onSubmit={handleSave}
			/>
		</section>
	);
};