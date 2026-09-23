import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { landmarkApi } from '../../../utils/api/LandmarkApi';
import { audioGuideApi } from '../../../utils/api/AudioGuideApi';
import { fileApi } from '../../../utils/api/FileApi';
import { Button, Input, Modal, Textarea } from '@ui';
import { Landmark } from '../../../types/Landmark';
import { AudioGuide } from '../../../types/AudioGuide';

import styles from './LandmarksEdit.module.scss';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';

export const LandmarksEdit = () => {
	const navigate = useNavigate();
	const [audioGuides, setAudioGuides] = useState<AudioGuide[]>([]);
	const [error, setError] = useState<string | null>(null);

	const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(
		null
	);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [audioGuideId, setAudioGuideId] = useState('');
	const [audioGuideSearch, setAudioGuideSearch] = useState('');
	const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
	const [imageUrls, setImageUrls] = useState<Record<string, string[]>>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
	const [images, setImages] = useState<File[]>([]);
	const [search, setSearch] = useState('');

	const {
		items: landmarks,
		loading: isLoading,
		reset,
		loaderRef,
	} = useInfiniteScroll<Landmark>({
		loadPage: async (page, size) => {
			const response = await landmarkApi.search({
				page,
				size,
			});

			if (!response.success || !response.data) {
				return {
					content: [],
					totalPages: 0,
				};
			}

			return response.data;
		},
	});

	const loadAudioGuides = async () => {
		try {
			const response = await audioGuideApi.search({
				page: 0,
				size: 100,
			});

			if (response.success && response.data) {
				setAudioGuides(response.data.content);
			}
		} catch {
			setError('Ошибка загрузки аудиогидов');
		}
	};

	useEffect(() => {
		loadAudioGuides();
	}, []);

	const resetForm = () => {
		setEditingLandmark(null);
		setTitle('');
		setDescription('');
		setAudioGuideId('');
		setAudioGuideSearch('');
		setImages([]);
	};

	const handleCreate = async () => {
		const response = await landmarkApi.create({
			title,
			description,
			audioGuideId: audioGuideId || undefined,
		});

		if (!response.success || !response.data) return;

		if (images.length) {
			await landmarkApi.uploadImages(response.data.id, images);
		}

		reset();
		closeModal();
	};

	const handleUpdate = async () => {
		if (!editingLandmark) return;

		const response = await landmarkApi.update(editingLandmark.id, {
			title,
			description,
			audioGuideId: audioGuideId || undefined,
		});

		if (!response.success) return;

		if (images.length) {
			await landmarkApi.uploadImages(editingLandmark.id, images);
		}

		reset();
		closeModal();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Удалить достопримечательность?')) return;
		const response = await landmarkApi.delete(id);
		if (!response.success) return;
		reset();
	};

	const filteredLandmarks = landmarks.filter((landmark) =>
		landmark.title.toLowerCase().includes(search.toLowerCase())
	);

	const filteredGuides =
		audioGuideSearch.trim().length > 0
			? audioGuides.filter((guide) =>
					guide.title
						.toLowerCase()
						.includes(audioGuideSearch.toLowerCase())
			  ) ?? []
			: [];

	const startEdit = async (landmark: Landmark) => {
		setEditingLandmark(landmark);
		setTitle(landmark.title);
		setDescription(landmark.description);
		setAudioGuideId(landmark.audioGuide?.id ?? '');
		setAudioGuideSearch(landmark.audioGuide?.title ?? '');
		setImages([]);
		setIsModalOpen(true);
	};

	useEffect(() => {
		const loadImages = async () => {
			const unloaded = landmarks.filter((l) => !imageUrls[l.id]);

			if (!unloaded.length) return;

			const entries = await Promise.all(
				unloaded.map(async (landmark) => {
					const images = await Promise.all(
						(landmark.images ?? []).map(async (image) => {
							const response = await fileApi.download(image.id);

							return response.success && response.data
								? response.data
								: null;
						})
					);

					return [
						landmark.id,
						images.filter((url): url is string => url !== null),
					] as const;
				})
			);

			setImageUrls((prev) => ({
				...prev,
				...Object.fromEntries(entries),
			}));
		};

		loadImages();
	}, [landmarks]);

	useEffect(() => {
		const loadAudio = async () => {
			if (!landmarks.length) return;

			const entries = await Promise.all(
				landmarks.map(async (landmark) => {
					const fileId = landmark.audioGuide?.file?.id;

					if (!fileId) {
						return null;
					}

					const response = await fileApi.download(fileId);

					if (!response.success || !response.data) {
						return null;
					}

					return [landmark.id, response.data] as const;
				})
			);

			setAudioUrls(
				Object.fromEntries(
					entries.filter(
						(entry): entry is readonly [string, string] =>
							entry !== null
					)
				)
			);
		};

		loadAudio();
	}, [landmarks]);

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
				<Button variant='secondary' onClick={() => navigate('/admin')}>
					Назад
				</Button>

				<Input
					placeholder='Поиск достопримечательностей...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={styles.searchInput}
				/>

				<Button variant='primary' onClick={openCreateModal}>
					Создать достопримечательность
				</Button>
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
					{filteredLandmarks.map((landmark) => (
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

			<div ref={loaderRef} className={styles.loader}>
				{isLoading && <p>Загрузка...</p>}
			</div>

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

					<div className={styles.autocomplete}>
						<Input
							label={'Аудиогид'}
							value={audioGuideSearch}
							placeholder='Начните вводить название...'
							onChange={(e) => {
								setAudioGuideSearch(e.target.value);
								setIsGuideDropdownOpen(true);
							}}
							onFocus={() => setIsGuideDropdownOpen(true)}
						/>

						{isGuideDropdownOpen && (
							<div className={styles.dropdown}>
								<div
									className={styles.option}
									onClick={() => {
										setAudioGuideId('');
										setAudioGuideSearch('');
										setIsGuideDropdownOpen(false);
									}}>
									Без аудиогида
								</div>

								{filteredGuides.map((guide) => (
									<div
										key={guide.id}
										className={styles.option}
										onClick={() => {
											setAudioGuideId(guide.id);
											setAudioGuideSearch(guide.title);
											setIsGuideDropdownOpen(false);
										}}>
										{guide.title}
									</div>
								))}
							</div>
						)}
					</div>

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
						Перетащите изображения сюда
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
