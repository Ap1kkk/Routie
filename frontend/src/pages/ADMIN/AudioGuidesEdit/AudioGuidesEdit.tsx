import React, { useEffect, useRef, useState } from 'react';
import {
	searchAudioGuides,
	createAudioGuide,
	updateAudioGuide,
	deleteAudioGuide,
	uploadAudioGuideFile,
} from '../../../services/slices/audioGuideSlice/audioGuideSlice';
import { downloadFile } from '../../../services/slices/fileSlice/fileSlice';
import { AudioGuide } from '../../../types/AudioGuide';
import { useDispatch, useSelector } from '@store';

import styles from './AudioGuidesEdit.module.scss';
import { Button, Input, Modal } from '@ui';
import { useNavigate } from 'react-router-dom';

export const AudioGuidesEdit = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { searchResults, isLoading, error } = useSelector(
		(state) => state.audioGuides
	);

	const [guideSearch, setGuideSearch] = useState('');
	const [title, setTitle] = useState('');
	const [durationSeconds, setDurationSeconds] = useState(0);
	const [editingGuide, setEditingGuide] = useState<AudioGuide | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
	const audioUrlsRef = useRef<Record<string, string>>({});
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		loadAudioGuides();
	}, []);

	useEffect(() => {
		audioUrlsRef.current = audioUrls;
	}, [audioUrls]);

	useEffect(() => {
		return () => {
			Object.values(audioUrlsRef.current).forEach((url) => {
				URL.revokeObjectURL(url);
			});
		};
	}, []);

	const filteredGuides =
		searchResults?.content.filter((guide) =>
			guide.title.toLowerCase().includes(guideSearch.toLowerCase())
		) ?? [];

	const loadAudioGuides = () => {
		dispatch(
			searchAudioGuides({
				page: 0,
				size: 20,
			})
		);
	};

	const resetForm = () => {
		setEditingGuide(null);
		setTitle('');
		setDurationSeconds(0);
		setFile(null);
	};

	const openCreateModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const closeModal = () => {
		resetForm();
		setIsModalOpen(false);
	};

	const handleCreate = async () => {
		const result = await dispatch(
			createAudioGuide({
				title,
				durationSeconds,
			})
		);
		if (!createAudioGuide.fulfilled.match(result)) return;
		if (file) {
			await dispatch(
				uploadAudioGuideFile({
					audioGuideId: result.payload.id,
					file,
				})
			);
		}
		loadAudioGuides();
		closeModal();
	};

	const handleUpdate = async () => {
		if (!editingGuide) return;

		await dispatch(
			updateAudioGuide({
				audioGuideId: editingGuide.id,
				data: {
					title,
					durationSeconds,
				},
			})
		);

		if (file) {
			await dispatch(
				uploadAudioGuideFile({
					audioGuideId: editingGuide.id,
					file,
				})
			);
		}
		loadAudioGuides();
		closeModal();
	};

	const handleDelete = async (audioGuideId: string) => {
		await dispatch(deleteAudioGuide(audioGuideId));
		loadAudioGuides();
	};

	const startEdit = (guide: AudioGuide) => {
		setEditingGuide(guide);
		setTitle(guide.title);
		setDurationSeconds(guide.durationSeconds);
		setFile(null);
		setIsModalOpen(true);
	};

	const handleLoadAudio = async (audioGuideId: string, fileId: string) => {
		if (audioUrls[audioGuideId]) return;

		const result = await dispatch(downloadFile(fileId));

		if (!downloadFile.fulfilled.match(result)) return;

		setAudioUrls((prev) => ({
			...prev,
			[audioGuideId]: result.payload,
		}));
	};

	return (
		<section className={styles.section}>
			<h2 className={styles.title}>Управление аудиогидами</h2>

			<div className={styles.headerActions}>
				<Button
					variant='secondary'
					onClick={() => navigate('/admin')}>
					Назад
				</Button>

				<Input
					className={styles.searchInput}
					placeholder='Поиск аудиогида...'
					value={guideSearch}
					onChange={(e) => setGuideSearch(e.target.value)}
				/>

				<Button
					variant='primary'
					onClick={openCreateModal}>
					Создать аудиогид
				</Button>
			</div>

			{isLoading && <p className={styles.loading}>Загрузка...</p>}

			{error && <p className={styles.error}>Ошибка: {error}</p>}

			<table className={styles.table}>
				<thead className={styles.tableHead}>
					<tr className={styles.tableRow}>
						<th className={styles.tableHeader}>Название</th>
						<th className={styles.tableHeader}>Длительность</th>
						<th className={styles.tableHeader}>Файл</th>
						<th className={styles.tableHeader}>Прослушать</th>
						<th className={styles.tableHeader}>Действия</th>
					</tr>
				</thead>

				<tbody className={styles.tableBody}>
					{filteredGuides.map((guide) => (
						<tr key={guide.id} className={styles.tableRow}>
							<td className={styles.tableCell}>{guide.title}</td>

							<td className={styles.tableCell}>
								{guide.durationSeconds} сек
							</td>

							<td className={styles.tableCell}>
								{guide.file?.filename ?? 'Нет файла'}
							</td>

							<td className={styles.tableCell}>
								{guide.file ? (
									audioUrls[guide.id] ? (
										<audio
											controls
											src={audioUrls[guide.id]}
											className={styles.audioPlayer}
										/>
									) : (
										<Button
											variant='secondary'
											onClick={() =>
												handleLoadAudio(
													guide.id,
													guide.file.id
												)
											}>
											Загрузить
										</Button>
									)
								) : (
									'Нет файла'
								)}
							</td>

							<td className={styles.tableCell}>
								<div className={styles.actions}>
									<Button
										variant='primary'
										onClick={() => startEdit(guide)}
										children={'Редактировать'}
										className={styles.buttonActions}
									/>

									<Button
										variant='secondary'
										onClick={() => handleDelete(guide.id)}
										children={'Удалить'}
										className={styles.buttonActions}
									/>
								</div>
							</td>
						</tr>
					))}

					{searchResults?.content.length === 0 && (
						<tr>
							<td colSpan={5} className={styles.emptyState}>
								Аудиогиды отсутствуют
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				className={styles.modal}>
				<div className={styles.modalContent}>
					<h3>
						{editingGuide
							? 'Редактирование аудиогида'
							: 'Создание аудиогида'}
					</h3>

					<Input
						label={'Название'}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Input
						label={'Длительность (сек)'}
						type='number'
						value={durationSeconds}
						onChange={(e) =>
							setDurationSeconds(Number(e.target.value))
						}
					/>

					<Input
						label={'Файл'}
						type='file'
						accept='audio/*'
						className={styles.fileInput}
						onChange={(e) => setFile(e.target.files?.[0] ?? null)}
					/>

					{editingGuide && audioUrls[editingGuide.id] && (
						<div className={styles.formGroup}>
							<label>Текущий файл</label>

							<audio
								controls
								src={audioUrls[editingGuide.id]}
								className={styles.modalAudio}
							/>
						</div>
					)}

					<div className={styles.modalActions}>
						<Button
							variant='secondary'
							onClick={closeModal}
							children={'Отмена'}
						/>

						<Button
							variant='primary'
							onClick={editingGuide ? handleUpdate : handleCreate}
							children={editingGuide ? 'Сохранить' : 'Создать'}
						/>
					</div>
				</div>
			</Modal>
		</section>
	);
};
