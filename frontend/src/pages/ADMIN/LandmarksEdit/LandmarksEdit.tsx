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

import { useDispatch, useSelector } from '@store';

export const LandmarksEdit = () => {
	const dispatch = useDispatch();

	const { searchResults, isLoading } = useSelector(
		(state) => state.landmarks
	);

	const { searchResults: audioGuides } = useSelector(
		(state) => state.audioGuides
	);

	const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(
		null
	);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [audioGuideId, setAudioGuideId] = useState('');
	const [images, setImages] = useState<FileList | null>(null);

	const [imageUrls, setImageUrls] = useState<Record<string, string[]>>({});

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
		setImages(null);
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
			const landmark = result.payload;

			if (images) {
				for (const file of Array.from(images)) {
					await dispatch(
						uploadLandmarkImages({
							landmarkId: landmark.id,
							file,
						})
					);
				}
			}

			resetForm();
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

		if (images) {
			for (const file of Array.from(images)) {
				await dispatch(
					uploadLandmarkImages({
						landmarkId: editingLandmark.id,
						file,
					})
				);
			}
		}

		resetForm();
		loadData();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Удалить достопримечательность?')) return;

		await dispatch(deleteLandmark(id));

		loadData();
	};

	const startEdit = (landmark: Landmark) => {
		setEditingLandmark(landmark);
		setTitle(landmark.title);
		setDescription(landmark.description);
		setAudioGuideId(landmark.audioGuide?.id ?? '');
	};

	useEffect(() => {
		const loadImages = async () => {
			if (!searchResults?.content) return;

			const urls: Record<string, string[]> = {};

			for (const landmark of searchResults.content) {
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
	}, [searchResults, dispatch]);

	return (
		<div className='p-4'>
			<h2>Управление достопримечательностями</h2>

			<div
				style={{
					border: '1px solid #ccc',
					padding: 16,
					marginBottom: 24,
				}}>
				<h3>{editingLandmark ? 'Редактирование' : 'Создание'}</h3>

				<div>
					<label>Название</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<label>Описание</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div>
					<label>Аудиогид</label>

					<select
						value={audioGuideId}
						onChange={(e) => setAudioGuideId(e.target.value)}>
						<option value=''>Без аудиогида</option>

						{audioGuides?.content.map((guide) => (
							<option key={guide.id} value={guide.id}>
								{guide.title}
							</option>
						))}
					</select>
				</div>

				<div>
					<label>Изображения</label>

					<input
						type='file'
						multiple
						accept='image/*'
						onChange={(e) => setImages(e.target.files)}
					/>
				</div>

				<div style={{ marginTop: 12 }}>
					{editingLandmark ? (
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
						<th>Описание</th>
						<th>Аудиогид</th>
						<th>Изображения</th>
						<th />
					</tr>
				</thead>

				<tbody>
					{searchResults?.content.map((landmark) => (
						<tr key={landmark.id}>
							<td>{landmark.title}</td>

							<td>{landmark.description}</td>

							<td>{landmark.audioGuide?.title ?? '-'}</td>

							<td>
								<div
									style={{
										display: 'flex',
										gap: 8,
									}}>
									{imageUrls[landmark.id]?.map(
										(url, index) => (
											<img
												key={index}
												src={url}
												alt=''
												style={{
													width: 80,
													height: 80,
													objectFit: 'cover',
												}}
											/>
										)
									)}
								</div>
							</td>

							<td>
								<button onClick={() => startEdit(landmark)}>
									Редактировать
								</button>

								<button
									onClick={() => handleDelete(landmark.id)}>
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
