import React, { useEffect, useState } from 'react';
import { AchievementItem } from '../../../types/achievments';
import { useDispatch, useSelector } from '@store';
import { fetchAchievements } from '../../../services/slices/achievementsSlice/achievementsSlice';

import styles from './AchievementsEdit.module.scss';
import { Button, Input } from '@ui';

export const AchievementsEdit = () => {
	const dispatch = useDispatch();
	const {
		items: achievements,
		loading,
		error,
	} = useSelector((state) => state.achievements);

	const [editingAchievement, setEditingAchievement] =
		useState<AchievementItem | null>(null);
	const [formData, setFormData] = useState<Partial<AchievementItem>>({});
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		dispatch(fetchAchievements());
	}, [dispatch]);

	const handleEditClick = (achievement: AchievementItem) => {
		setEditingAchievement(achievement);
		setFormData({ ...achievement });
		setIsAdding(false);
	};

	const handleAddNew = () => {
		setEditingAchievement(null);
		setFormData({
			id: '',
			title: '',
			value: '',
			finishValue: '',
			caption: '',
		});
		setIsAdding(true);
	};

	const handleSave = async () => {
		if (isAdding) {
			alert('Новое достижение создано!');
		} else {
			alert('Достижение обновлено!');
		}
		setEditingAchievement(null);
		setIsAdding(false);
		setFormData({});
	};

	const handleCancel = () => {
		setEditingAchievement(null);
		setIsAdding(false);
		setFormData({});
	};

	if (loading)
		return <div className={styles.loading}>Загрузка достижений...</div>;
	if (error) return <div className={styles.error}>Ошибка: {error}</div>;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Управление достижениями</h1>
				<Button
					variant={'secondary'}
					onClick={handleAddNew}
					children={'+ Добавить достижение'}
				/>
			</div>

			<p>
				Всего достижений: <strong>{achievements.length}</strong>
			</p>

			<table className={styles.achievementsTable}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Название</th>
						<th>Текущее значение</th>
						<th>Целевое значение</th>
						<th>Подпись</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{achievements.length === 0 ? (
						<tr>
							<td colSpan={6} className={styles.empty}>
								Достижения не найдены
							</td>
						</tr>
					) : (
						achievements.map((ach) => (
							<tr key={ach.id}>
								<td>{ach.id.slice(0, 8)}...</td>
								<td>{ach.title}</td>
								<td>{ach.value}</td>
								<td>{ach.finishValue}</td>
								<td>{ach.caption}</td>
								<td>
									<Button
										variant={'secondary'}
										onClick={() => handleEditClick(ach)}>
										Редактировать
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			{(editingAchievement || isAdding) && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<h2>
							{isAdding
								? 'Новое достижение'
								: 'Редактирование достижения'}
						</h2>

						<Input
							label={'Название'}
							value={formData.title || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
						/>

						<Input
							label={'Текущее значение'}
							value={formData.value || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									value: e.target.value,
								})
							}
						/>

						<Input
							label={'Целевое значение'}
							value={formData.finishValue || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									finishValue: e.target.value,
								})
							}
						/>

						<Input
							label={'Подпись'}
							value={formData.caption || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									caption: e.target.value,
								})
							}
						/>

						<div className={styles.buttons}>
							<Button
								onClick={handleCancel}
								className={styles.cancelBtn}
								children={'Отмена'}
							/>
							<Button
								onClick={handleSave}
								className={styles.saveBtn}
								children={isAdding ? 'Создать' : 'Сохранить'}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
