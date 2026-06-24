import { Landmark } from '../../../types/Landmark';
import { useEffect, useState } from 'react';
import { downloadFileApi } from '../../../utils/api/FileApi';

import styles from './LandmarkPopup.module.scss';

interface Props {
	landmark: Landmark;
}

export const LandmarkPopup = ({ landmark }: Props) => {
	const [imageUrl, setImageUrl] = useState('');
	const [audioUrl, setAudioUrl] = useState('');

	useEffect(() => {
		const loadImage = async () => {
			if (!landmark.images?.length) return;

			try {
				const response = await downloadFileApi(landmark.images[0].id);

				if (response.success && response.data) {
					setImageUrl(response.data);
				}
			} catch (e) {
				console.error(e);
			}
		};

		loadImage();

		return () => {
			if (imageUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(imageUrl);
			}
		};
	}, [landmark]);

	useEffect(() => {
		const loadAudio = async () => {
			if (!landmark.audioGuide?.file?.id) return;

			try {
				const response = await downloadFileApi(
					landmark.audioGuide.file.id
				);

				if (response.success && response.data) {
					setAudioUrl(response.data);
				}
			} catch (e) {
				console.error(e);
			}
		};

		loadAudio();
	}, [landmark]);

	return (
		<div className={styles.popup}>
			{imageUrl && (
				<img
					src={imageUrl}
					alt={landmark.title}
					className={styles.imagePopup}
				/>
			)}
			<article className={styles.popupContainer}>
				<h3>{landmark.title}</h3>

				<p>{landmark.description}</p>

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
