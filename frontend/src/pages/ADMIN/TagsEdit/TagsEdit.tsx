import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import {
	createTag,
	deleteTag,
	fetchAllTags,
} from '../../../services/slices/tagsSlice/tagsSlice';

export const TagsEdit = () => {
	const dispatch = useDispatch();

	const { allTags, isLoading, error } = useSelector(
		(state) => state.tags
	);

	const [newTagTitle, setNewTagTitle] = useState('');

	useEffect(() => {
		dispatch(fetchAllTags());
	}, [dispatch]);

	const handleCreateTag = async () => {
		if (!newTagTitle.trim()) return;

		await dispatch(
			createTag({
				title: newTagTitle.trim(),
			})
		);

		setNewTagTitle('');
	};

	const handleDeleteTag = async (tagId: string) => {
		if (!window.confirm('Удалить тег?')) return;

		await dispatch(deleteTag(tagId));
	};

	return (
		<div style={{ padding: '20px' }}>
			<h1>Управление тегами</h1>

			<div
				style={{
					display: 'flex',
					gap: '10px',
					marginBottom: '20px',
				}}
			>
				<input
					type="text"
					placeholder="Название тега"
					value={newTagTitle}
					onChange={(e) => setNewTagTitle(e.target.value)}
				/>

				<button onClick={handleCreateTag}>
					Добавить тег
				</button>
			</div>

			{isLoading && <p>Загрузка...</p>}

			{error && (
				<p style={{ color: 'red' }}>
					Ошибка: {error}
				</p>
			)}

			<table
				style={{
					width: '100%',
					borderCollapse: 'collapse',
				}}
			>
				<thead>
				<tr>
					<th
						style={{
							border: '1px solid #ddd',
							padding: '8px',
						}}
					>
						ID
					</th>

					<th
						style={{
							border: '1px solid #ddd',
							padding: '8px',
						}}
					>
						Название
					</th>

					<th
						style={{
							border: '1px solid #ddd',
							padding: '8px',
						}}
					>
						Действия
					</th>
				</tr>
				</thead>

				<tbody>
				{allTags?.map((tag : any) => (
					<tr key={tag.id}>
						<td
							style={{
								border: '1px solid #ddd',
								padding: '8px',
							}}
						>
							{tag.id}
						</td>

						<td
							style={{
								border: '1px solid #ddd',
								padding: '8px',
							}}
						>
							{tag.title}
						</td>

						<td
							style={{
								border: '1px solid #ddd',
								padding: '8px',
							}}
						>
							<button
								onClick={() =>
									handleDeleteTag(tag.id)
								}
							>
								Удалить
							</button>
						</td>
					</tr>
				))}

				{allTags?.length === 0 && (
					<tr>
						<td colSpan={3}>
							Теги отсутствуют
						</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	);
};