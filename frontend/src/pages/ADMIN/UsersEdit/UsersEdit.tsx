import React, { useEffect, useState } from 'react';
import { UserForAdmin } from '../../../types/user';
import { useDispatch, useSelector } from '@store';
import {
	fetchAllUsers,
	updateUserById,
} from '../../../services/slices/userSlice/userSlice';

import styles from './UsersEdit.module.scss';
import { Button, Input, Select } from '@ui';

export const UsersEdit = () => {
	const dispatch = useDispatch();

	const { allUsers, allUsersLoading, updatingUser } = useSelector(
		(state) => state.user
	);

	const [editingUser, setEditingUser] = useState<UserForAdmin | null>(null);
	const [formData, setFormData] = useState<Partial<UserForAdmin>>({});

	useEffect(() => {
		dispatch(fetchAllUsers());
	}, [dispatch]);

	const handleEditClick = (user: UserForAdmin) => {
		setEditingUser(user);
		setFormData({ ...user });
	};

	const handleSave = async () => {
		if (!editingUser?.id) return;

		try {
			await dispatch(
				updateUserById({
					id: editingUser.id,
					data: formData,
				})
			).unwrap();

			setEditingUser(null);
			setFormData({});
			alert('Пользователь успешно обновлён!');
		} catch (err: any) {
			alert(err || 'Ошибка сохранения');
		}
	};

	const handleCancel = () => {
		setEditingUser(null);
		setFormData({});
	};

	if (allUsersLoading) {
		return <div className={styles.loading}>Загрузка пользователей...</div>;
	}

	return (
		<div className={styles.container}>
			<h1>Управление пользователями</h1>
			<p>
				Всего пользователей: <strong>{allUsers.length}</strong>
			</p>

			<table className={styles.usersTable}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Имя</th>
						<th>Username</th>
						<th>Email</th>
						<th>Телефон</th>
						<th>Уровень</th>
						<th>Роль</th>
					</tr>
				</thead>
				<tbody>
					{allUsers.length === 0 ? (
						<tr>
							<td colSpan={8} className={styles.empty}>
								Пользователи не найдены
							</td>
						</tr>
					) : (
						allUsers.map((user: any) => (
							<tr key={user.id}>
								<td>{user.id.slice(0, 8)}...</td>
								<td>{user.name || '—'}</td>
								<td>{user.username}</td>
								<td>{user.email}</td>
								<td>{user.number || '—'}</td>
								<td>{user.level}</td>
								<td>
									<span
										className={`${styles.role} ${
											styles[
												(
													user.role || 'USER'
												).toLowerCase()
											]
										}`}>
										{user.role || 'USER'}
									</span>
								</td>
								<td>
									<Button
										variant={'secondary'}
										onClick={() => handleEditClick(user)}
										disabled={updatingUser}>
										Редактировать
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			{editingUser && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<h2>Редактирование пользователя</h2>
						<p>
							<strong>ID:</strong> {editingUser.id}
						</p>

						<Input
							label='Имя:'
							value={formData.name || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
						/>

						<Input
							label='Username:'
							value={formData.username || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									username: e.target.value,
								})
							}
						/>

						<Input
							label='Email:'
							value={formData.email || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
						/>

						<Input
							label='Телефон:'
							value={formData.number || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									number: e.target.value,
								})
							}
						/>

						<Input
							label='Уровень:'
							type='number'
							value={formData.level ?? 1}
							onChange={(e) =>
								setFormData({
									...formData,
									level: +e.target.value,
								})
							}
						/>

						<Select
							label='Роль:'
							options={[
								{ value: 'USER', label: 'Пользователь' },
								{ value: 'ADMIN', label: 'Администратор' },
							]}
							value={formData.role || 'USER'}
							onChange={(value) =>
								setFormData({
									...formData,
									role: value as 'USER' | 'ADMIN',
								})
							}
						/>

						<div className={styles.buttons}>
							<Button
								onClick={handleCancel}
								className={styles.cancelBtn}>
								Отмена
							</Button>
							<Button
								onClick={handleSave}
								className={styles.saveBtn}
								disabled={updatingUser}>
								{updatingUser ? 'Сохранение...' : 'Сохранить'}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
