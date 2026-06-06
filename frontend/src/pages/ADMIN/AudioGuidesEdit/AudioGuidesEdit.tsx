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

export const AudioGuidesEdit = () => {
	const dispatch = useDispatch();

	const { searchResults, isLoading } = useSelector(
		(state) => state.audioGuides
	);

	const [editingGuide, setEditingGuide] = useState<AudioGuide | null>(null);

	const [title, setTitle] = useState('');
	const [durationSeconds, setDurationSeconds] = useState(0);
	const [file, setFile] = useState<File | null>(null);

	const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

	const audioUrlsRef = useRef<Record<string, string>>({});

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

	const loadAudioGuides = () => {
		dispatch(
			searchAudioGuides({
				page: 0,
				size: 100,
			})
		);
	};

	const resetForm = () => {
		setEditingGuide(null);
		setTitle('');
		setDurationSeconds(0);
		setFile(null);
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

		resetForm();
		loadAudioGuides();
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

		resetForm();
		loadAudioGuides();
	};

	const handleDelete = async (audioGuideId: string) => {
		if (!window.confirm('Удалить аудиогид?')) return;

		await dispatch(deleteAudioGuide(audioGuideId));
		loadAudioGuides();
	};

	const startEdit = (guide: AudioGuide) => {
		setEditingGuide(guide);
		setTitle(guide.title);
		setDurationSeconds(guide.durationSeconds);
		setFile(null);
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
		<div className='p-4'>
			<h2>Управление аудиогидами</h2>

			<div
				style={{
					border: '1px solid #ccc',
					padding: 16,
					marginBottom: 24,
				}}>
				<h3>
					{editingGuide
						? 'Редактирование аудиогида'
						: 'Создание аудиогида'}
				</h3>

				<div>
					<label>Название</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<label>Длительность (сек)</label>
					<input
						type='number'
						value={durationSeconds}
						onChange={(e) =>
							setDurationSeconds(Number(e.target.value))
						}
					/>
				</div>

				<div>
					<label>Файл</label>
					<input
						type='file'
						accept='audio/*'
						onChange={(e) => setFile(e.target.files?.[0] ?? null)}
					/>
				</div>

				<div style={{ marginTop: 12 }}>
					{editingGuide ? (
						<>
							<button onClick={handleUpdate}>Сохранить</button>

							<button onClick={resetForm}>Отмена</button>
						</>
					) : (
						<button onClick={handleCreate}>Создать</button>
					)}
				</div>
			</div>

			{isLoading && <p>Загрузка...</p>}

			<table>
				<thead>
					<tr>
						<th>Название</th>
						<th>Длительность</th>
						<th>Файл</th>
						<th>Прослушать</th>
						<th>Действия</th>
					</tr>
				</thead>

				<tbody>
					{searchResults?.content.map((guide) => (
						<tr key={guide.id}>
							<td>{guide.title}</td>

							<td>{guide.durationSeconds} сек</td>

							<td>{guide.file?.filename ?? 'Нет файла'}</td>

							<td>
								{guide.file ? (
									audioUrls[guide.id] ? (
										<audio
											controls
											src={audioUrls[guide.id]}
											style={{ width: 250 }}
										/>
									) : (
										<button
											onClick={() =>
												handleLoadAudio(
													guide.id,
													guide.file.id
												)
											}>
											▶ Прослушать
										</button>
									)
								) : (
									'Нет файла'
								)}
							</td>

							<td>
								<button onClick={() => startEdit(guide)}>
									Редактировать
								</button>

								<button onClick={() => handleDelete(guide.id)}>
									Удалить
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
