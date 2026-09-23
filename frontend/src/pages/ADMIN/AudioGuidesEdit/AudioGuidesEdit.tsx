import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal } from '@ui';
import { useNavigate } from 'react-router-dom';
import { fileApi } from '../../../utils/api/FileApi';
import { audioGuideApi } from '../../../utils/api/AudioGuideApi';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { AudioGuide } from '../../../types/AudioGuide';

import { ReactComponent as Cross } from '../../../assets/icons/cross.svg';

import styles from './AudioGuidesEdit.module.scss';

export const AudioGuidesEdit = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const [guideSearch, setGuideSearch] = useState('');

	const [title, setTitle] = useState('');
	const [durationSeconds, setDurationSeconds] = useState(0);
	const [editingGuide, setEditingGuide] = useState<AudioGuide | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
	const audioUrlsRef = useRef<Record<string, string>>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [removeCurrentFile, setRemoveCurrentFile] = useState(false);

	const {
		items: guides,
		loading: isLoading,
		reset,
		loaderRef,
	} = useInfiniteScroll<AudioGuide>({
		loadPage: async (page, size) => {
			const response = await audioGuideApi.search({
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

	const filteredGuides = guides.filter((guide) =>
		guide.title.toLowerCase().includes(guideSearch.toLowerCase())
	);

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
		const response = await audioGuideApi.create({
			title,
			durationSeconds,
		});

		if (!response.success) return;
		closeModal();
		reset();
	};

	const handleUpdate = async () => {
		if (!editingGuide) return;

		const response = await audioGuideApi.update(editingGuide.id, {
			title,
			durationSeconds,
		});

		if (!response.success) return;

		if (removeCurrentFile && editingGuide.file) {
			await fileApi.delete(editingGuide.file.id);
		}

		if (file) {
			await audioGuideApi.uploadFile(editingGuide.id, file);
		}

		closeModal();
		reset();
	};

	const handleDelete = async (audioGuideId: string) => {
		const response = await audioGuideApi.delete(audioGuideId);
		if (!response.success) return;
		reset();
	};

	const handleLoadAudio = async (audioGuideId: string, fileId: string) => {
		if (audioUrls[audioGuideId]) return;

		try {
			const response = await fileApi.download(fileId);

			if (!response.success || !response.data) return;

			setAudioUrls((prev) => ({
				...prev,
				[audioGuideId]: response.data!,
			}));
		} catch (error) {
			console.error(error);
		}
	};

	const startEdit = (guide: AudioGuide) => {
		setEditingGuide(guide);
		setTitle(guide.title);
		setDurationSeconds(guide.durationSeconds);
		setFile(null);
		setRemoveCurrentFile(false);
		setIsModalOpen(true);
	};

	const markFileForDeletion = () => {
		setRemoveCurrentFile(true);
	};

	return (
		<section className={styles.section}>
			<h2 className={styles.title}>Управление аудиогидами</h2>

			<div className={styles.headerActions}>
				<Button variant='secondary' onClick={() => navigate('/admin')}>
					Назад
				</Button>

				<Input
					className={styles.searchInput}
					placeholder='Поиск аудиогида...'
					value={guideSearch}
					onChange={(e) => setGuideSearch(e.target.value)}
				/>

				<Button variant='primary' onClick={openCreateModal}>
					Создать аудиогид
				</Button>
			</div>

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
													guide.file!.id
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

					{guides.length === 0 && (
						<tr>
							<td colSpan={5} className={styles.emptyState}>
								Аудиогиды отсутствуют
							</td>
						</tr>
					)}
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

					{editingGuide?.file && !removeCurrentFile ? (
						<div className={styles.formGroup}>
							<span> Удалить аудиогид </span>
							<p className={styles.deleteAudioForm}>
								{editingGuide.file.filename}
								<Button
									variant='secondary'
									onClick={markFileForDeletion}
									iconRight={<Cross />}
									className={styles.buttonDeleteAudio}
								/>
							</p>
						</div>
					) : (
						<Input
							label='Новый файл'
							type='file'
							accept='audio/*'
							onChange={(e) =>
								setFile(e.target.files?.[0] ?? null)
							}
						/>
					)}

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
