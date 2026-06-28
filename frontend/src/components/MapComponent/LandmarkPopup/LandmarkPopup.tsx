import { Landmark } from '../../../types/Landmark';
import { useEffect, useState, useRef, memo } from 'react';
import { downloadFileApi } from '../../../utils/api/FileApi';

import styles from './LandmarkPopup.module.scss';

interface Props {
	landmark: Landmark | null;
}

const LandmarkPopupComponent = ({ landmark }: Props) => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [audioUrl, setAudioUrl] = useState<string>('');
	const isLoadedRef = useRef(false);

	if (!landmark) {
		return (
			<div className={styles.popup}>
				<article className={styles.popupContainer}>
					<h3>Информация отсутствует</h3>
					<p>Данные о landmark не найдены.</p>
				</article>
			</div>
		);
	}

	useEffect(() => {
		if (isLoadedRef.current || !landmark.images?.length) return;

		isLoadedRef.current = true;

		const load = async () => {
			try {
				const res = await downloadFileApi(landmark.images[0].id);
				if (res.success && res.data) {
					setImageUrl(res.data);
				}
			} catch (e) {
				console.error('Ошибка загрузки изображения:', e);
			}
		};

		load();

		return () => {
			if (imageUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(imageUrl);
			}
		};
	}, [landmark.id]);

	useEffect(() => {
		if (!landmark.audioGuide?.file?.id) return;

		const loadAudio = async () => {
			try {
				const res = await downloadFileApi(landmark.audioGuide!.file!.id);
				if (res.success && res.data) {
					setAudioUrl(res.data);
				}
			} catch (e) {
				console.error('Ошибка загрузки аудио:', e);
			}
		};

		loadAudio();
	}, [landmark.audioGuide?.file?.id]);

	return (
		<div className={styles.popup}>
			{imageUrl && (
				<img
					src={imageUrl}
					alt={landmark.title || 'Landmark'}
					className={styles.imagePopup}
					loading='lazy'
					decoding='async'
				/>
			)}

			<article className={styles.popupContainer}>
				<h3 className={styles.textPopup}>
					{landmark.title || 'Без названия'}
				</h3>
				<p className={styles.textPopup}>
					{landmark.description || 'Описание отсутствует'}
				</p>

				{audioUrl && landmark.audioGuide?.file && (
					<audio controls className={styles.audioControle}>
						<source
							src={audioUrl}
							type={landmark.audioGuide.file.contentType}
						/>
					</audio>
				)}
			</article>
		</div>
	);
};

export const LandmarkPopup = memo(LandmarkPopupComponent);
LandmarkPopup.displayName = 'LandmarkPopup';