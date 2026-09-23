import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tagApi } from '../../../utils/api/TagApi';
import { Button, Input, Modal } from '@ui';
import { Tags } from '../../../types/Tags';

import styles from './TagsEdit.module.scss';

export const TagsEdit = () => {
	const navigate = useNavigate();

	const [tags, setTags] = useState<Tags[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [editingTag, setEditingTag] = useState<Tags | null>(null);
	const [tagTitle, setTagTitle] = useState('');

	const [tagSearch, setTagSearch] = useState('');

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		loadTags();
	}, []);

	const loadTags = async () => {
		try {
			setIsLoading(true);

			const response = await tagApi.getAll();

			if (!response.success || !response.data) {
				setError(response.error?.message ?? 'Ошибка загрузки тегов');
				return;
			}

			setTags(response.data);
		} catch {
			setError('Ошибка загрузки тегов');
		} finally {
			setIsLoading(false);
		}
	};

	const filteredTags = tags.filter((tag) =>
		tag.title.toLowerCase().includes(tagSearch.toLowerCase())
	);

	const handleDeleteTag = async (tagId: string) => {
		const response = await tagApi.delete(tagId);

		if (!response.success) return;

		loadTags();
	};

	const openCreateModal = () => {
		setEditingTag(null);
		setTagTitle('');
		setIsModalOpen(true);
	};

	const openEditModal = (tag: Tags) => {
		setEditingTag(tag);
		setTagTitle(tag.title);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setEditingTag(null);
		setTagTitle('');
		setIsModalOpen(false);
	};

	const handleSave = async () => {
		if (!tagTitle.trim()) return;

		if (editingTag) {
			const response = await tagApi.update(editingTag.id, {
				title: tagTitle.trim(),
			});

			if (!response.success) return;
		} else {
			const response = await tagApi.create({
				title: tagTitle.trim(),
			});

			if (!response.success) return;
		}

		closeModal();
		loadTags();
	};

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>Управление тегами</h3>

			<div className={styles.headerActions}>
				<Button
					variant='secondary'
					onClick={() => navigate('/admin')}>
					Назад
				</Button>

				<Input
					className={styles.searchInput}
					placeholder='Поиск тега...'
					value={tagSearch}
					onChange={(e) => setTagSearch(e.target.value)}
				/>

				<Button
					variant='primary'
					onClick={openCreateModal}>
					Создать тег
				</Button>
			</div>

			{isLoading && <p className={styles.loading}>Загрузка...</p>}

			{error && <p className={styles.error}>Ошибка: {error}</p>}

			<table className={styles.table}>
				<thead className={styles.tableHead}>
					<tr className={styles.tableRow}>
						<th className={styles.tableHeader}>Название</th>
						<th className={styles.tableHeader}>Действия</th>
					</tr>
				</thead>

				<tbody className={styles.tableBody}>
					{filteredTags?.map((tag) => (
						<tr key={tag.id} className={styles.tableRow}>
							<td className={styles.tableCell}>{tag.title}</td>

							<td className={styles.tableCell}>
								<div className={styles.actions}>
									<Button
										variant='primary'
										onClick={() => openEditModal(tag)}
										children={'Редактировать'}
										className={styles.buttonActions}
									/>

									<Button
										variant='secondary'
										onClick={() => handleDeleteTag(tag.id)}
										children={'Удалить'}
										className={styles.buttonActions}
									/>
								</div>
							</td>
						</tr>
					))}

					{tags.length === 0 && (
						<tr className={styles.tableRow}>
							<td colSpan={3} className={styles.emptyState}>
								Теги отсутствуют
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
					<h3 className={styles.modalTitle}>
						{editingTag ? 'Редактирование тега' : 'Создание тега'}
					</h3>

					<Input
						label={'Название тега'}
						type='text'
						value={tagTitle}
						inputPadding='12px 24px'
						onChange={(e) => setTagTitle(e.target.value)}
					/>

					<div className={styles.modalActions}>
						<Button
							variant='secondary'
							onClick={closeModal}
							children={'Отмена'}
						/>

						<Button
							variant='primary'
							onClick={handleSave}
							children={editingTag ? 'Сохранить' : 'Создать'}
						/>
					</div>
				</div>
			</Modal>
		</section>
	);
};
