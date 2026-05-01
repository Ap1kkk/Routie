import userExample from '../assets/images/avatarProfile/avatar2.png';
import {
	User,
	Friend,
	RoutesHistoryUser,
	FriendsUser,
	AvatarUser,
	UserTags,
	RoleUser,
} from '../types/user';
import { Route } from '../types/route';
import { Tags } from '../types/tags';

const USER_UUIDS = {
	CURRENT: '11111111-1111-1111-1111-111111111111',
	FRIEND_1: '22222222-2222-2222-2222-222222222222',
	FRIEND_2: '33333333-3333-3333-3333-333333333333',
	FRIEND_3: '44444444-4444-4444-4444-444444444444',
	FRIEND_4: '55555555-5555-5555-5555-555555555555',
	FRIEND_5: '66666666-6666-6666-6666-666666666666',
	FRIEND_6: '77777777-7777-7777-7777-777777777777',
	FRIEND_7: '88888888-8888-8888-8888-888888888888',
};

const generateUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
};

const friend1: Friend = {
	id: USER_UUIDS.FRIEND_1,
	username: '@anna_smirnova',
	name: 'Анна Смирнова',
	avatar: '/avatars/anna.jpg',
};

const friend2: Friend = {
	id: USER_UUIDS.FRIEND_2,
	username: '@dima_ivanov',
	name: 'Дмитрий Иванов',
	avatar: '/avatars/dima.jpg',
};

const routeTags: Tags[] = [
	{ id: '1', label: 'Кремль' },
	{ id: '2', label: 'История' },
	{ id: '3', label: 'Архитектура' },
	{ id: '4', label: 'Пешеходный' },
	{ id: '5', label: 'Улица' },
	{ id: '6', label: 'Достопримечательности' },
];

const recentRoutesList: Route[] = [
	{
		id: 'route-11111111-1111-1111-1111-111111111111',
		name: 'Нижегородский Кремль',
		distance: 2100,
		checkpoints: [
			{
				id: 'cp-1',
				latitude: 56.328,
				longitude: 44.002,
				order: 1,
				name: 'Дмитриевская башня',
			},
			{
				id: 'cp-2',
				latitude: 56.329,
				longitude: 44.004,
				order: 2,
				name: 'Кладовая башня',
			},
			{
				id: 'cp-3',
				latitude: 56.33,
				longitude: 44.003,
				order: 3,
				name: 'Никольская башня',
			},
			{
				id: 'cp-4',
				latitude: 56.331,
				longitude: 44.001,
				order: 4,
				name: 'Коромыслова башня',
			},
			{
				id: 'cp-5',
				latitude: 56.33,
				longitude: 43.998,
				order: 5,
				name: 'Тайницкая башня',
			},
			{
				id: 'cp-6',
				latitude: 56.328,
				longitude: 43.999,
				order: 6,
				name: 'Северная башня',
			},
			{
				id: 'cp-7',
				latitude: 56.327,
				longitude: 44.0,
				order: 7,
				name: 'Ивановская башня',
			},
			{
				id: 'cp-8',
				latitude: 56.327,
				longitude: 44.002,
				order: 8,
				name: 'Часовой двор',
			},
			{
				id: 'cp-9',
				latitude: 56.328,
				longitude: 44.002,
				order: 9,
				name: 'Возврат к Дмитриевской башне',
			},
		],
		tags: [routeTags[0], routeTags[1], routeTags[2]],
		createdAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'route-22222222-2222-2222-2222-222222222222',
		name: 'Большая Покровская улица',
		distance: 1400,
		checkpoints: [
			{
				id: 'cp-10',
				latitude: 56.326,
				longitude: 44.007,
				order: 1,
				name: 'Площадь Горького',
			},
			{
				id: 'cp-11',
				latitude: 56.325,
				longitude: 44.005,
				order: 2,
				name: 'Театр драмы',
			},
			{
				id: 'cp-12',
				latitude: 56.324,
				longitude: 44.003,
				order: 3,
				name: 'Дом связи',
			},
			{
				id: 'cp-13',
				latitude: 56.323,
				longitude: 44.001,
				order: 4,
				name: 'Кинотеатр Октябрь',
			},
			{
				id: 'cp-14',
				latitude: 56.322,
				longitude: 43.999,
				order: 5,
				name: 'Центральный универмаг',
			},
			{
				id: 'cp-15',
				latitude: 56.321,
				longitude: 43.997,
				order: 6,
				name: 'Памятник Чкалову',
			},
			{
				id: 'cp-16',
				latitude: 56.32,
				longitude: 43.995,
				order: 7,
				name: 'Здание Государственного банка',
			},
			{
				id: 'cp-17',
				latitude: 56.319,
				longitude: 43.993,
				order: 8,
				name: 'Мининский сквер',
			},
			{
				id: 'cp-18',
				latitude: 56.318,
				longitude: 43.991,
				order: 9,
				name: 'Площадь Минина',
			},
		],
		tags: [routeTags[3], routeTags[4], routeTags[5]],
		createdAt: '2024-01-02T00:00:00Z',
	},
];

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

export const MOCK_USER_ROUTES_HISTORY: RoutesHistoryUser = {
	user_id: USER_UUIDS.CURRENT,
	historyRoutes: recentRoutesList,
};

export const MOCK_USER_FRIENDS: FriendsUser = {
	user_id: USER_UUIDS.CURRENT,
	friends: [friend1, friend2],
};

export const MOCK_USER_AVATAR: AvatarUser = {
	id: generateUUID(),
	user_id: USER_UUIDS.CURRENT,
	avatar: userExample,
};

export const MOCK_USER_TAGS: UserTags = {
	user_id: USER_UUIDS.CURRENT,
	tags: [routeTags[1], routeTags[2], routeTags[4]],
};

export const MOCK_USER_ROLE: RoleUser = {
	user_id: USER_UUIDS.CURRENT,
	role: 'USER',
};

export const MOCK_USER_FULL = {
	user: MOCK_USER,
	avatar: MOCK_USER_AVATAR,
	tags: MOCK_USER_TAGS,
	role: MOCK_USER_ROLE,
	friends: MOCK_USER_FRIENDS,
	routesHistory: MOCK_USER_ROUTES_HISTORY,
};

export const getUserById = (id: string): User | undefined => {
	if (id === USER_UUIDS.CURRENT) return MOCK_USER;
	if (id === USER_UUIDS.FRIEND_1) {
		return {
			...MOCK_USER,
			id: USER_UUIDS.FRIEND_1,
			username: '@anna_smirnova',
			name: 'Анна Смирнова',
			email: 'anna@example.com',
			number: '+79081234567',
			level: 38,
			gender: 'female',
			height: 168,
			weight: 60,
			birthday: '1995-06-25',
			isAuthenticated: false,
		};
	}
	if (id === USER_UUIDS.FRIEND_2) {
		return {
			...MOCK_USER,
			id: USER_UUIDS.FRIEND_2,
			username: '@dima_ivanov',
			name: 'Дмитрий Иванов',
			email: 'dima@example.com',
			number: '+79087654321',
			level: 45,
			gender: 'male',
			height: 180,
			weight: 82,
			birthday: '1988-12-10',
			isAuthenticated: false,
		};
	}
	return undefined;
};

export const getUserAvatar = (userId: string): string | undefined => {
	if (userId === USER_UUIDS.CURRENT) return userExample;
	if (userId === USER_UUIDS.FRIEND_1) return '/avatars/anna.jpg';
	if (userId === USER_UUIDS.FRIEND_2) return '/avatars/dima.jpg';
	return undefined;
};

export const getUserFriends = (userId: string): Friend[] => {
	if (userId === USER_UUIDS.CURRENT) return [friend1, friend2];
	return [];
};

export const getUserRoutesHistory = (userId: string): Route[] => {
	if (userId === USER_UUIDS.CURRENT) return recentRoutesList;
	return [];
};
