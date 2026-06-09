import React, { useEffect, useState } from 'react';
import {
	createLandmark,
	deleteLandmark,
	searchLandmarks,
	updateLandmark,
	uploadLandmarkImages,
} from '../../../services/slices/landmarkSlice/landmarkSlice';
import { searchAudioGuides } from '../../../services/slices/audioGuideSlice/audioGuideSlice';
import { downloadFile } from '../../../services/slices/fileSlice/fileSlice';
import { Landmark } from '../../../types/Landmark';
import { Button, Input, Modal, Select, Textarea } from '@ui';
import { useDispatch, useSelector } from '@store';

import styles from './LandmarksEdit.module.scss';

export const LandmarksEdit = () => {
	const dispatch = useDispatch();
	const {
		searchResults: landmarkResults,
		isLoading,
		error,
	} = useSelector((state) => state.landmarks);
	const { searchResults: audioGuideResults } = useSelector(
		(state) => state.audioGuides
	);
	const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(
		null
	);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [audioGuideId, setAudioGuideId] = useState('');
	const [imageUrls, setImageUrls] = useState<Record<string, string[]>>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
	const [images, setImages] = useState<File[]>([]);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		dispatch(searchLandmarks({ page: 0, size: 100 }));
		dispatch(searchAudioGuides({ page: 0, size: 100 }));
	};

	const resetForm = () => {
		setEditingLandmark(null);
		setTitle('');
		setDescription('');
		setAudioGuideId('');
		setImages([]);
	};

	const handleCreate = async () => {
		const result = await dispatch(
			createLandmark({
				title,
				description,
				audioGuideId: audioGuideId || undefined,
			})
		);

		if (createLandmark.fulfilled.match(result)) {
			if (images.length) {
				await dispatch(
					uploadLandmarkImages({
						landmarkId: result.payload.id,
						files: images,
					})
				);
			}
			closeModal();
			loadData();
		}
	};

	const handleUpdate = async () => {
		if (!editingLandmark) return;

		await dispatch(
			updateLandmark({
				landmarkId: editingLandmark.id,
				data: {
					title,
					description,
					audioGuideId: audioGuideId || undefined,
				},
			})
		);

		if (images.length) {
			await dispatch(
				uploadLandmarkImages({
					landmarkId: editingLandmark.id,
					files: images,
				})
			);
		}

		closeModal();
		loadData();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Удалить достопримечательность?')) return;
		await dispatch(deleteLandmark(id));
		loadData();
	};

	const startEdit = async (landmark: Landmark) => {
		setEditingLandmark(landmark);
		setTitle(landmark.title);
		setDescription(landmark.description);
		setAudioGuideId(landmark.audioGuide?.id ?? '');

		if (landmark.images && landmark.images.length > 0) {
			const imagesWithUrls = [];
			for (const image of landmark.images) {
				const result = await dispatch(downloadFile(image.id));
				if (downloadFile.fulfilled.match(result)) {
					imagesWithUrls.push({ id: image.id, url: result.payload });
				}
			}
		}

		setImages([]);
		setIsModalOpen(true);
	};

	useEffect(() => {
		const loadImages = async () => {
			if (!landmarkResults?.content) return;

			const urls: Record<string, string[]> = {};

			for (const landmark of landmarkResults.content) {
				const images: string[] = [];

				for (const image of landmark.images || []) {
					const result = await dispatch(downloadFile(image.id));

					if (downloadFile.fulfilled.match(result)) {
						images.push(result.payload);
					}
				}

				urls[landmark.id] = images;
			}

			setImageUrls(urls);
		};

		loadImages();
	}, [landmarkResults, dispatch]);

	useEffect(() => {
		const loadAudio = async () => {
			if (!landmarkResults?.content) return;

			const urls: Record<string, string> = {};

			for (const landmark of landmarkResults.content) {
				const fileId = landmark.audioGuide?.file?.id;

				if (!fileId) continue;

				const result = await dispatch(downloadFile(fileId));

				if (downloadFile.fulfilled.match(result)) {
					urls[landmark.id] = result.payload;
				}
			}

			setAudioUrls(urls);
		};

		loadAudio();
	}, [landmarkResults]);

	const openCreateModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const closeModal = () => {
		resetForm();
		setIsModalOpen(false);
	};

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>Управление достопримечательностями</h3>

			<div className={styles.headerActions}>
				<Button
					variant='primary'
					onClick={openCreateModal}
					children={'Создать достопримечательность'}
				/>
			</div>

			{isLoading && <p className={styles.loading}>Загрузка...</p>}

			{error && <p className={styles.error}>Ошибка: {error}</p>}

			<table className={styles.table}>
				<thead className={styles.tableHead}>
					<tr className={styles.tableRow}>
						<th className={styles.tableHeader}>Название</th>
						<th className={styles.tableHeader}>Описание</th>
						<th className={styles.tableHeader}>Аудиогид</th>
						<th className={styles.tableHeader}>Изображения</th>
						<th className={styles.tableHeader}>Действия</th>
					</tr>
				</thead>

				<tbody className={styles.tableBody}>
					{landmarkResults?.content.map((landmark) => (
						<tr key={landmark.id} className={styles.tableRow}>
							<td className={styles.tableCell}>
								{landmark.title}
							</td>

							<td className={styles.tableCell}>
								{landmark.description}
							</td>

							<td className={styles.tableCell}>
								{audioUrls[landmark.id] ? (
									<audio
										controls
										preload='metadata'
										className={styles.audioPlayer}>
										<source src={audioUrls[landmark.id]} />
									</audio>
								) : (
									'-'
								)}
							</td>

							<td className={styles.tableCell}>
								<div className={styles.imagesContainer}>
									{imageUrls[landmark.id]
										?.slice(0, 4)
										.map((url) => (
											<img
												key={url}
												src={url}
												className={styles.image}
												alt=''
											/>
										))}
								</div>
							</td>

							<td className={styles.tableCell}>
								<div className={styles.actions}>
									<Button
										variant={'primary'}
										onClick={() => startEdit(landmark)}
										children={'Редактировать'}
									/>
									<Button
										variant={'secondary'}
										onClick={() =>
											handleDelete(landmark.id)
										}
										children={'Удалить'}
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				className={styles.modal}>
				<div className={styles.modalContent}>
					<h3>
						{editingLandmark
							? 'Редактирование достопримечательности'
							: 'Создание достопримечательности'}
					</h3>

					<Input
						label={'Название'}
						className={styles.input}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<div className={styles.formGroup}>
						<label>Описание</label>

						<Textarea
							className={styles.textarea}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<Select
						label={'Аудиогид'}
						className={styles.select}
						value={audioGuideId}
						onChange={setAudioGuideId}
						options={[
							{
								value: '',
								label: 'Без аудиогида',
							},
							...(audioGuideResults?.content.map((guide) => ({
								value: guide.id,
								label: guide.title,
							})) ?? []),
						]}
					/>

					{!!editingLandmark?.audioGuide &&
						audioUrls[editingLandmark.id] && (
							<div className={styles.formGroup}>
								<label>Текущий аудиогид</label>

								<audio controls className={styles.modalAudio}>
									<source
										src={audioUrls[editingLandmark.id]}
									/>
								</audio>
							</div>
						)}

					<div
						className={styles.dropZone}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							const files = Array.from(e.dataTransfer.files);
							setImages((prev) => [...prev, ...files]);
						}}>
						Перетащите изображения сюда или нажмите для выбора
					</div>

					{images.length > 0 && (
						<div className={styles.formGroup}>
							<label>Новые изображения:</label>
							<div className={styles.previewGrid}>
								{images.map((file, index) => (
									<div
										key={index}
										className={styles.imagePreview}>
										<img
											src={URL.createObjectURL(file)}
											alt={`Новое изображение ${
												index + 1
											}`}
											className={styles.previewImage}
										/>
										<button
											type='button'
											className={styles.deleteImageBtn}
											onClick={() =>
												setImages((prev) =>
													prev.filter(
														(_, i) => i !== index
													)
												)
											}>
											✕
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					<div className={styles.modalActions}>
						<Button variant='secondary' onClick={closeModal}>
							Отмена
						</Button>

						<Button
							variant='primary'
							onClick={
								editingLandmark ? handleUpdate : handleCreate
							}>
							{editingLandmark ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</div>
			</Modal>
		</section>
	);
};
