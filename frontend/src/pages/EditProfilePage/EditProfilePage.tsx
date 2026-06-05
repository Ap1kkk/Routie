import styles from './EditProfilePage.module.scss';
import { EditProfileForm } from '@components';
import { MOCK_USER } from '../../mocks/users';


export const EditProfilePage = () => {
	const formData = {
		name: MOCK_USER.name,
		weight: MOCK_USER.weight,
		height: MOCK_USER.height,
		avatar: null,
	};

	const handleUpdateData = (key: string, value: unknown) => {
		console.log(`Обновление поля ${key}:`, value);
	};

	return (
		<section className={styles.container}>
			<EditProfileForm
				data={formData}
				updateData={handleUpdateData}
				availablePreferences={'1231'}
			/>
		</section>
	);
};
