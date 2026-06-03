import {
	Friend,
	FriendsUser,
	RoleUser,
	RoutesHistoryUser,
	User,
	UserTags,
	UUID,
} from '../types/User';
import { Route } from '../types/Route';
import { Tags } from '../types/Tags';

const USER_UUIDS = {
	CURRENT: '11111111-1111-1111-1111-111111111111' as UUID,
	FRIEND_1: '22222222-2222-2222-2222-222222222222' as UUID,
	FRIEND_2: '33333333-3333-3333-3333-333333333333' as UUID,
} as const;

// ==================== MOCK ДАННЫЕ ====================

export const MOCK_USER: User = {
	id: USER_UUIDS.CURRENT,
	username: '@evgeniy020304',
	name: 'Евгений',
	email: 'evgeny@example.com',
	number: '+79081553950',
	password: '123456',
	level: 42,
	gender: 'male',
	height: 192,
	weight: 90,
	birthday: '1990-03-15',
	isAuthenticated: true,
};

export const MOCK_FRIENDS: Friend[] = [
	{
		id: USER_UUIDS.FRIEND_1,
		username: '@anna_smirnova',
		name: 'Анна Смирнова',
		avatar: '/avatars/anna.jpg',
	},
	{
		id: USER_UUIDS.FRIEND_2,
		username: '@dima_ivanov',
		name: 'Дмитрий Иванов',
		avatar: '/avatars/dima.jpg',
	},
];

const routeTags: Tags[] = [
	{ id: '1', title: 'Кремль' },
	{ id: '2', title: 'История' },
	{ id: '3', title: 'Архитектура' },
	{ id: '4', title: 'Пешеходный' },
	{ id: '5', title: 'Улица' },
	{ id: '6', title: 'Достопримечательности' },
];

export const MOCK_RECENT_ROUTES: Route[] = [
	{
		id: 'route-11111111-1111-1111-1111-111111111111' as UUID,
		title: 'Нижегородский Кремль',
		description: 'Прогулка по исторической части Нижнего Новгорода',
		type: 'HISTORICAL',
		difficulty: 3,
		lengthMeters: 2100,
		estimatedTimeMinutes: 45,
		city: 'Нижний Новгород',
		completionsCount: 1243,
		isActive: true,
		images: [],
		tags: [routeTags[0], routeTags[1], routeTags[2]],
	},
	{
		id: 'route-22222222-2222-2222-2222-222222222222' as UUID,
		title: 'Большая Покровская улица',
		description: 'Знаменитая пешеходная улица Нижнего Новгорода',
		type: 'CULTURAL',
		difficulty: 2,
		lengthMeters: 1400,
		estimatedTimeMinutes: 35,
		city: 'Нижний Новгород',
		completionsCount: 876,
		isActive: true,
		images: [],
		tags: [routeTags[3], routeTags[4], routeTags[5]],
	},
];

// ==================== КОМПЛЕКСНЫЕ МОКИ ====================

export const MOCK_USER_FULL = {
	user: MOCK_USER,
	friends: {
		user_id: USER_UUIDS.CURRENT,
		friends: MOCK_FRIENDS,
	} as FriendsUser,
	routesHistory: {
		user_id: USER_UUIDS.CURRENT,
		historyRoutes: MOCK_RECENT_ROUTES,
	} as RoutesHistoryUser,
	tags: {
		user_id: USER_UUIDS.CURRENT,
		tags: [routeTags[1], routeTags[2], routeTags[4]],
	} as UserTags,
	role: {
		user_id: USER_UUIDS.CURRENT,
		role: 'USER' as const,
	} as RoleUser,
};

// ==================== ХЕЛПЕРЫ ====================

export const getUserByUsername = (username: string): User | undefined => {
	const cleanUsername = username.startsWith('@') ? username : `@${username}`;

	if (cleanUsername === MOCK_USER.username) return MOCK_USER;

	return MOCK_FRIENDS.find((f) => f.username === cleanUsername) as
		| User
		| undefined;
};

export const getUserById = (id: UUID): User | undefined => {
	if (id === USER_UUIDS.CURRENT) return MOCK_USER;
	return undefined; // можно расширить
};
