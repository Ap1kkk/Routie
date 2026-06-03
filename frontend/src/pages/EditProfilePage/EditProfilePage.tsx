import styles from './EditProfilePage.module.scss';
import { EditProfileForm } from '@components';
import { MOCK_USER, MOCK_USER_AVATAR, MOCK_USER_TAGS } from '../../mocks/users';


export const EditProfilePage = () => {
	const formData = {
		name: MOCK_USER.name,
		weight: MOCK_USER.weight,
		height: MOCK_USER.height,
		avatar: null,
		preferences: MOCK_USER_TAGS.tags.map((tag : any) => tag.id),
	};

	const handleUpdateData = (key: string, value: unknown) => {
		console.log(`Обновление поля ${key}:`, value);
	};

	const availablePreferences = MOCK_USER_TAGS.tags;

	return (
		<section className={styles.container}>
			<EditProfileForm
				data={formData}
				updateData={handleUpdateData}
				availablePreferences={availablePreferences}
			/>
		</section>
	);
};
