import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import {
	createTag,
	deleteTag,
	fetchAllTags,
	updateTag,
} from '../../../services/slices/tagsSlice/tagsSlice';
import { Tags } from '../../../types/Tags';
import { Button, Input, Modal } from '@ui';

import styles from './TagsEdit.module.scss';

export const TagsEdit = () => {
	const dispatch = useDispatch();
	const { allTags, isLoading, error } = useSelector((state) => state.tags);

	const [editingTag, setEditingTag] = useState<Tags | null>(null);
	const [tagTitle, setTagTitle] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchAllTags());
	}, [dispatch]);

	const handleDeleteTag = async (tagId: string) => {
		await dispatch(deleteTag(tagId));
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
			await dispatch(
				updateTag({
					tagId: editingTag.id,
					data: {
						title: tagTitle.trim(),
					},
				})
			);
		} else {
			await dispatch(
				createTag({
					title: tagTitle.trim(),
				})
			);
		}
		closeModal();
	};

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>Управление тегами</h3>

			<div className={styles.headerActions}>
				<Button
					variant='primary'
					onClick={openCreateModal}
					children={'Создание тега'}
				/>
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
					{allTags?.map((tag) => (
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

					{allTags?.length === 0 && (
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
