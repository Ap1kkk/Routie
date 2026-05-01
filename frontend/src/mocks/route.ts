import { Route, RouteImage } from '../types/route';
import { Checkpoint, CheckpointImage, AudioGuide } from '../types/checkpoint';
import { Tags } from '../types/tags';

const ROUTE_UUIDS = {
	KREMLIN: 'route-11111111-1111-1111-1111-111111111111',
	POKROVSKAYA: 'route-22222222-2222-2222-2222-222222222222',
	FEDOROVSKOGO: 'route-33333333-3333-3333-3333-333333333333',
	CHKALOV_STAIRS: 'route-44444444-4444-4444-4444-444444444444',
	STRELKA: 'route-55555555-5555-5555-5555-555555555555',
	ALEXANDROVSKY_GARDEN: 'route-66666666-6666-6666-6666-666666666666',
	SWITZERLAND_PARK: 'route-77777777-7777-7777-7777-777777777777',
	CABLE_CAR: 'route-88888888-8888-8888-8888-888888888888',
	ROZHDESTVENSKAYA: 'route-99999999-9999-9999-9999-999999999999',
	PECHERSKY_MONASTERY: 'route-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
	SORMOVSKY_PARK: 'route-bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
	MYZA: 'route-cccccccc-cccc-cccc-cccc-cccccccccccc',
};

const tags: Tags[] = [
	{ id: '1', label: 'Кремль' },
	{ id: '2', label: 'История' },
	{ id: '3', label: 'Архитектура' },
	{ id: '4', label: 'Пешеходный' },
	{ id: '5', label: 'Улица' },
	{ id: '6', label: 'Достопримечательности' },
	{ id: '7', label: 'Набережная' },
	{ id: '8', label: 'Вид' },
	{ id: '9', label: 'Фото' },
	{ id: '10', label: 'Лестница' },
	{ id: '11', label: 'Монумент' },
	{ id: '12', label: 'Современный' },
	{ id: '13', label: 'Река' },
	{ id: '14', label: 'Спорт' },
	{ id: '15', label: 'Парк' },
	{ id: '16', label: 'Отдых' },
	{ id: '17', label: 'Прогулка' },
	{ id: '18', label: 'Природа' },
	{ id: '19', label: 'Активный отдых' },
	{ id: '20', label: 'Транспорт' },
	{ id: '21', label: 'Экскурсия' },
	{ id: '22', label: 'Культура' },
	{ id: '23', label: 'Рестораны' },
	{ id: '24', label: 'Монастырь' },
	{ id: '25', label: 'Духовное' },
	{ id: '26', label: 'Развлечения' },
	{ id: '27', label: 'Семейный' },
	{ id: '28', label: 'Лес' },
	{ id: '29', label: 'Треккинг' },
];

const kremlinCheckpoints: Checkpoint[] = [
	{
		id: 'cp-kremlin-1',
		latitude: 56.328,
		longitude: 44.002,
		order: 1,
		name: 'Дмитриевская башня',
		description: 'Главный вход в Нижегородский Кремль',
	},
	{
		id: 'cp-kremlin-2',
		latitude: 56.329,
		longitude: 44.004,
		order: 2,
		name: 'Кладовая башня',
	},
	{
		id: 'cp-kremlin-3',
		latitude: 56.33,
		longitude: 44.003,
		order: 3,
		name: 'Никольская башня',
	},
	{
		id: 'cp-kremlin-4',
		latitude: 56.331,
		longitude: 44.001,
		order: 4,
		name: 'Коромыслова башня',
	},
	{
		id: 'cp-kremlin-5',
		latitude: 56.33,
		longitude: 43.998,
		order: 5,
		name: 'Тайницкая башня',
	},
	{
		id: 'cp-kremlin-6',
		latitude: 56.328,
		longitude: 43.999,
		order: 6,
		name: 'Северная башня',
	},
	{
		id: 'cp-kremlin-7',
		latitude: 56.327,
		longitude: 44.0,
		order: 7,
		name: 'Ивановская башня',
	},
	{
		id: 'cp-kremlin-8',
		latitude: 56.327,
		longitude: 44.002,
		order: 8,
		name: 'Часовой двор',
	},
	{
		id: 'cp-kremlin-9',
		latitude: 56.328,
		longitude: 44.002,
		order: 9,
		name: 'Возврат к Дмитриевской башне',
	},
];

export const mockRouteKremlin: Route = {
	id: ROUTE_UUIDS.KREMLIN,
	name: 'Нижегородский Кремль',
	distance: 2100,
	checkpoints: kremlinCheckpoints,
	tags: [tags[0], tags[1], tags[2]],
	createdAt: '2024-01-01T00:00:00Z',
};

const pokrovskayaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-pok-1',
		latitude: 56.326,
		longitude: 44.007,
		order: 1,
		name: 'Площадь Горького',
	},
	{
		id: 'cp-pok-2',
		latitude: 56.325,
		longitude: 44.005,
		order: 2,
		name: 'Театр драмы',
	},
	{
		id: 'cp-pok-3',
		latitude: 56.324,
		longitude: 44.003,
		order: 3,
		name: 'Дом связи',
	},
	{
		id: 'cp-pok-4',
		latitude: 56.323,
		longitude: 44.001,
		order: 4,
		name: 'Кинотеатр Октябрь',
	},
	{
		id: 'cp-pok-5',
		latitude: 56.322,
		longitude: 43.999,
		order: 5,
		name: 'Центральный универмаг',
	},
	{
		id: 'cp-pok-6',
		latitude: 56.321,
		longitude: 43.997,
		order: 6,
		name: 'Памятник Чкалову',
	},
	{
		id: 'cp-pok-7',
		latitude: 56.32,
		longitude: 43.995,
		order: 7,
		name: 'Здание Государственного банка',
	},
	{
		id: 'cp-pok-8',
		latitude: 56.319,
		longitude: 43.993,
		order: 8,
		name: 'Мининский сквер',
	},
	{
		id: 'cp-pok-9',
		latitude: 56.318,
		longitude: 43.991,
		order: 9,
		name: 'Площадь Минина',
	},
];

export const mockRoutePokrovskaya: Route = {
	id: ROUTE_UUIDS.POKROVSKAYA,
	name: 'Большая Покровская улица',
	distance: 1400,
	checkpoints: pokrovskayaCheckpoints,
	tags: [tags[3], tags[4], tags[5]],
	createdAt: '2024-01-01T00:00:00Z',
};

const fedorovskogoCheckpoints: Checkpoint[] = [
	{
		id: 'cp-fed-1',
		latitude: 56.325,
		longitude: 44.021,
		order: 1,
		name: 'Канавинский мост',
	},
	{
		id: 'cp-fed-2',
		latitude: 56.324,
		longitude: 44.018,
		order: 2,
		name: 'Рождественская церковь',
	},
	{
		id: 'cp-fed-3',
		latitude: 56.323,
		longitude: 44.015,
		order: 3,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-fed-4',
		latitude: 56.322,
		longitude: 44.012,
		order: 4,
		name: 'Памятник Александру Невскому',
	},
	{
		id: 'cp-fed-5',
		latitude: 56.321,
		longitude: 44.009,
		order: 5,
		name: 'Речной вокзал',
	},
	{
		id: 'cp-fed-6',
		latitude: 56.32,
		longitude: 44.006,
		order: 6,
		name: 'Чкаловская лестница',
	},
	{
		id: 'cp-fed-7',
		latitude: 56.319,
		longitude: 44.003,
		order: 7,
		name: 'Александровский сад',
	},
];

export const mockRouteFedorovskogo: Route = {
	id: ROUTE_UUIDS.FEDOROVSKOGO,
	name: 'Набережная Федоровского',
	distance: 1800,
	checkpoints: fedorovskogoCheckpoints,
	tags: [tags[6], tags[7], tags[8]],
	createdAt: '2024-01-01T00:00:00Z',
};

const chkalovStairsCheckpoints: Checkpoint[] = [
	{
		id: 'cp-chkalov-1',
		latitude: 56.32,
		longitude: 44.006,
		order: 1,
		name: 'Верхняя точка',
		description: 'Памятник Чкалову',
	},
	{
		id: 'cp-chkalov-2',
		latitude: 56.321,
		longitude: 44.005,
		order: 2,
		name: 'Спуск (левая сторона)',
	},
	{
		id: 'cp-chkalov-3',
		latitude: 56.322,
		longitude: 44.004,
		order: 3,
		name: 'Промежуточная площадка',
	},
	{
		id: 'cp-chkalov-4',
		latitude: 56.323,
		longitude: 44.003,
		order: 4,
		name: 'Нижняя точка',
		description: 'Набережная',
	},
	{
		id: 'cp-chkalov-5',
		latitude: 56.322,
		longitude: 44.002,
		order: 5,
		name: 'Подъем (правая сторона)',
	},
	{
		id: 'cp-chkalov-6',
		latitude: 56.321,
		longitude: 44.004,
		order: 6,
		name: 'Верхняя площадка',
	},
	{
		id: 'cp-chkalov-7',
		latitude: 56.32,
		longitude: 44.006,
		order: 7,
		name: 'Возврат к памятнику',
	},
];

export const mockRouteChkalovStairs: Route = {
	id: ROUTE_UUIDS.CHKALOV_STAIRS,
	name: 'Чкаловская лестница',
	distance: 800,
	checkpoints: chkalovStairsCheckpoints,
	tags: [tags[9], tags[10], tags[1]],
	createdAt: '2024-01-01T00:00:00Z',
};

const strelkaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-strelka-1',
		latitude: 56.334,
		longitude: 43.972,
		order: 1,
		name: 'Стадион Нижний Новгород',
	},
	{
		id: 'cp-strelka-2',
		latitude: 56.336,
		longitude: 43.975,
		order: 2,
		name: 'Собор Александра Невского',
	},
	{
		id: 'cp-strelka-3',
		latitude: 56.338,
		longitude: 43.978,
		order: 3,
		name: 'Пакгаузы',
	},
	{
		id: 'cp-strelka-4',
		latitude: 56.34,
		longitude: 43.982,
		order: 4,
		name: 'Причал',
	},
	{
		id: 'cp-strelka-5',
		latitude: 56.342,
		longitude: 43.986,
		order: 5,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-strelka-6',
		latitude: 56.341,
		longitude: 43.99,
		order: 6,
		name: 'Парк',
	},
	{
		id: 'cp-strelka-7',
		latitude: 56.339,
		longitude: 43.985,
		order: 7,
		name: 'Возврат к стадиону',
	},
];

export const mockRouteStrelka: Route = {
	id: ROUTE_UUIDS.STRELKA,
	name: 'Стрелка',
	distance: 3200,
	checkpoints: strelkaCheckpoints,
	tags: [tags[11], tags[12], tags[13]],
	createdAt: '2024-01-01T00:00:00Z',
};

const alexandrovskyGardenCheckpoints: Checkpoint[] = [
	{
		id: 'cp-garden-1',
		latitude: 56.323,
		longitude: 44.001,
		order: 1,
		name: 'Вход со стороны Кремля',
	},
	{
		id: 'cp-garden-2',
		latitude: 56.322,
		longitude: 44.0,
		order: 2,
		name: 'Фонтан',
	},
	{
		id: 'cp-garden-3',
		latitude: 56.321,
		longitude: 43.999,
		order: 3,
		name: 'Детская площадка',
	},
	{
		id: 'cp-garden-4',
		latitude: 56.32,
		longitude: 43.998,
		order: 4,
		name: 'Скамейки у воды',
	},
	{
		id: 'cp-garden-5',
		latitude: 56.319,
		longitude: 43.997,
		order: 5,
		name: 'Ротонда',
	},
	{
		id: 'cp-garden-6',
		latitude: 56.32,
		longitude: 43.996,
		order: 6,
		name: 'Мостик',
	},
	{
		id: 'cp-garden-7',
		latitude: 56.321,
		longitude: 43.998,
		order: 7,
		name: 'Аллея',
	},
	{
		id: 'cp-garden-8',
		latitude: 56.322,
		longitude: 44.0,
		order: 8,
		name: 'Возврат к фонтану',
	},
];

export const mockRouteAlexandrovskyGarden: Route = {
	id: ROUTE_UUIDS.ALEXANDROVSKY_GARDEN,
	name: 'Александровский сад',
	distance: 1500,
	checkpoints: alexandrovskyGardenCheckpoints,
	tags: [tags[14], tags[15], tags[16]],
	createdAt: '2024-01-01T00:00:00Z',
};

const switzerlandParkCheckpoints: Checkpoint[] = [
	{
		id: 'cp-swiss-1',
		latitude: 56.295,
		longitude: 43.993,
		order: 1,
		name: 'Главный вход',
		description: 'Проспект Гагарина',
	},
	{
		id: 'cp-swiss-2',
		latitude: 56.298,
		longitude: 43.995,
		order: 2,
		name: 'Канатная дорога',
	},
	{
		id: 'cp-swiss-3',
		latitude: 56.302,
		longitude: 43.998,
		order: 3,
		name: 'Зеленый театр',
	},
	{
		id: 'cp-swiss-4',
		latitude: 56.306,
		longitude: 44.002,
		order: 4,
		name: 'Спортивные площадки',
	},
	{
		id: 'cp-swiss-5',
		latitude: 56.31,
		longitude: 44.005,
		order: 5,
		name: 'Детский городок',
	},
	{
		id: 'cp-swiss-6',
		latitude: 56.308,
		longitude: 44.008,
		order: 6,
		name: 'Кафе',
	},
	{
		id: 'cp-swiss-7',
		latitude: 56.303,
		longitude: 44.003,
		order: 7,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-swiss-8',
		latitude: 56.298,
		longitude: 43.998,
		order: 8,
		name: 'Обратно к канатной дороге',
	},
];

export const mockRouteSwitzerlandPark: Route = {
	id: ROUTE_UUIDS.SWITZERLAND_PARK,
	name: 'Парк Швейцария',
	distance: 4500,
	checkpoints: switzerlandParkCheckpoints,
	tags: [tags[14], tags[17], tags[18]],
	createdAt: '2024-01-01T00:00:00Z',
};

const cableCarCheckpoints: Checkpoint[] = [
	{
		id: 'cp-cable-1',
		latitude: 56.326,
		longitude: 44.041,
		order: 1,
		name: 'Нижняя станция',
		description: 'Нижний Новгород',
	},
	{
		id: 'cp-cable-2',
		latitude: 56.331,
		longitude: 44.034,
		order: 2,
		name: 'Опора 1',
	},
	{
		id: 'cp-cable-3',
		latitude: 56.336,
		longitude: 44.027,
		order: 3,
		name: 'Опора 2',
	},
	{
		id: 'cp-cable-4',
		latitude: 56.341,
		longitude: 44.02,
		order: 4,
		name: 'Опора 3',
	},
	{
		id: 'cp-cable-5',
		latitude: 56.346,
		longitude: 44.013,
		order: 5,
		name: 'Над Волгой',
	},
	{
		id: 'cp-cable-6',
		latitude: 56.351,
		longitude: 44.006,
		order: 6,
		name: 'Опора 4',
	},
	{
		id: 'cp-cable-7',
		latitude: 56.356,
		longitude: 43.999,
		order: 7,
		name: 'Верхняя станция',
		description: 'Бор',
	},
	{
		id: 'cp-cable-8',
		latitude: 56.351,
		longitude: 44.006,
		order: 8,
		name: 'Обратный путь',
	},
];

export const mockRouteCableCar: Route = {
	id: ROUTE_UUIDS.CABLE_CAR,
	name: 'Канатная дорога',
	distance: 3700,
	checkpoints: cableCarCheckpoints,
	tags: [tags[7], tags[19], tags[20]],
	createdAt: '2024-01-01T00:00:00Z',
};

const rozhdestvenskayaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-rozh-1',
		latitude: 56.327,
		longitude: 44.01,
		order: 1,
		name: 'Площадь Народного Единства',
	},
	{
		id: 'cp-rozh-2',
		latitude: 56.326,
		longitude: 44.008,
		order: 2,
		name: 'Церковь Рождества Иоанна Предтечи',
	},
	{
		id: 'cp-rozh-3',
		latitude: 56.325,
		longitude: 44.006,
		order: 3,
		name: 'Особняки купцов',
	},
	{
		id: 'cp-rozh-4',
		latitude: 56.324,
		longitude: 44.004,
		order: 4,
		name: 'Ресторанная улица',
	},
	{
		id: 'cp-rozh-5',
		latitude: 56.323,
		longitude: 44.002,
		order: 5,
		name: 'Музей Добролюбова',
	},
	{
		id: 'cp-rozh-6',
		latitude: 56.322,
		longitude: 44.0,
		order: 6,
		name: 'Блиновский пассаж',
	},
	{
		id: 'cp-rozh-7',
		latitude: 56.321,
		longitude: 43.998,
		order: 7,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-rozh-8',
		latitude: 56.322,
		longitude: 44.001,
		order: 8,
		name: 'Возврат',
	},
];

export const mockRouteRozhdestvenskaya: Route = {
	id: ROUTE_UUIDS.ROZHDESTVENSKAYA,
	name: 'Рождественская улица',
	distance: 1300,
	checkpoints: rozhdestvenskayaCheckpoints,
	tags: [tags[1], tags[21], tags[22]],
	createdAt: '2024-01-01T00:00:00Z',
};

const pecherskyMonasteryCheckpoints: Checkpoint[] = [
	{
		id: 'cp-pecher-1',
		latitude: 56.305,
		longitude: 44.045,
		order: 1,
		name: 'Вход в монастырь',
	},
	{
		id: 'cp-pecher-2',
		latitude: 56.306,
		longitude: 44.044,
		order: 2,
		name: 'Вознесенский собор',
	},
	{
		id: 'cp-pecher-3',
		latitude: 56.307,
		longitude: 44.043,
		order: 3,
		name: 'Колокольня',
	},
	{
		id: 'cp-pecher-4',
		latitude: 56.308,
		longitude: 44.042,
		order: 4,
		name: 'Монастырские стены',
	},
	{
		id: 'cp-pecher-5',
		latitude: 56.309,
		longitude: 44.044,
		order: 5,
		name: 'Смотровая площадка',
	},
	{
		id: 'cp-pecher-6',
		latitude: 56.307,
		longitude: 44.046,
		order: 6,
		name: 'Святые ворота',
	},
	{
		id: 'cp-pecher-7',
		latitude: 56.305,
		longitude: 44.045,
		order: 7,
		name: 'Возврат',
	},
];

export const mockRoutePecherskyMonastery: Route = {
	id: ROUTE_UUIDS.PECHERSKY_MONASTERY,
	name: 'Печерский монастырь',
	distance: 2800,
	checkpoints: pecherskyMonasteryCheckpoints,
	tags: [tags[23], tags[24], tags[2]],
	createdAt: '2024-01-01T00:00:00Z',
};

const sormovskyParkCheckpoints: Checkpoint[] = [
	{
		id: 'cp-sorm-1',
		latitude: 56.354,
		longitude: 43.869,
		order: 1,
		name: 'Главный вход',
	},
	{
		id: 'cp-sorm-2',
		latitude: 56.356,
		longitude: 43.872,
		order: 2,
		name: 'Колесо обозрения',
	},
	{
		id: 'cp-sorm-3',
		latitude: 56.358,
		longitude: 43.875,
		order: 3,
		name: 'Пруды',
	},
	{
		id: 'cp-sorm-4',
		latitude: 56.36,
		longitude: 43.878,
		order: 4,
		name: 'Аттракционы',
	},
	{
		id: 'cp-sorm-5',
		latitude: 56.358,
		longitude: 43.882,
		order: 5,
		name: 'Спортивная зона',
	},
	{
		id: 'cp-sorm-6',
		latitude: 56.355,
		longitude: 43.88,
		order: 6,
		name: 'Кафе',
	},
	{
		id: 'cp-sorm-7',
		latitude: 56.353,
		longitude: 43.875,
		order: 7,
		name: 'Аллея',
	},
	{
		id: 'cp-sorm-8',
		latitude: 56.354,
		longitude: 43.871,
		order: 8,
		name: 'Возврат',
	},
];

export const mockRouteSormovskyPark: Route = {
	id: ROUTE_UUIDS.SORMOVSKY_PARK,
	name: 'Сормовский парк',
	distance: 3800,
	checkpoints: sormovskyParkCheckpoints,
	tags: [tags[14], tags[25], tags[26]],
	createdAt: '2024-01-01T00:00:00Z',
};

const myzaCheckpoints: Checkpoint[] = [
	{
		id: 'cp-myza-1',
		latitude: 56.282,
		longitude: 43.97,
		order: 1,
		name: 'Вход',
	},
	{
		id: 'cp-myza-2',
		latitude: 56.285,
		longitude: 43.975,
		order: 2,
		name: 'Лесная тропа',
	},
	{
		id: 'cp-myza-3',
		latitude: 56.289,
		longitude: 43.98,
		order: 3,
		name: 'Родник',
	},
	{
		id: 'cp-myza-4',
		latitude: 56.293,
		longitude: 43.985,
		order: 4,
		name: 'Поляна',
	},
	{
		id: 'cp-myza-5',
		latitude: 56.297,
		longitude: 43.99,
		order: 5,
		name: 'Смотровая',
	},
	{
		id: 'cp-myza-6',
		latitude: 56.293,
		longitude: 43.995,
		order: 6,
		name: 'Овраг',
	},
	{
		id: 'cp-myza-7',
		latitude: 56.288,
		longitude: 43.985,
		order: 7,
		name: 'Возврат',
	},
];

export const mockRouteMyza: Route = {
	id: ROUTE_UUIDS.MYZA,
	name: 'Лесопарк Мыза',
	distance: 5200,
	checkpoints: myzaCheckpoints,
	tags: [tags[27], tags[17], tags[28]],
	createdAt: '2024-01-01T00:00:00Z',
};

export const mockRouteImages: RouteImage[] = [
	{
		id: 'img-route-1111',
		routeId: ROUTE_UUIDS.KREMLIN,
		imagePath:
			'data:image/jpeg;base64,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',
	},
	{
		id: 'img-route-2222',
		routeId: ROUTE_UUIDS.POKROVSKAYA,
		imagePath:
			'https://nn-grad.ru/images/places/src/Ulica_Bol_shaya_Pokrovskaya_v_Nizhnem_Novgorode_(1).jpg',
	},
	{
		id: 'img-route-3333',
		routeId: ROUTE_UUIDS.FEDOROVSKOGO,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj6jBKQ6BIs_Y1plbAoR3ioY21jhTC0UKaLA&s',
	},
	{
		id: 'img-route-4444',
		routeId: ROUTE_UUIDS.CHKALOV_STAIRS,
		imagePath:
			'https://s12.stc.all.kpcdn.net/russia/wp-content/uploads/2020/11/chkalovskaya-lestnitsa-1330-530x322.jpg',
	},
	{
		id: 'img-route-5555',
		routeId: ROUTE_UUIDS.STRELKA,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLyIheudmsmvwmCS5NQ6syxVyt79RkB_hwWQ&s',
	},
	{
		id: 'img-route-6666',
		routeId: ROUTE_UUIDS.ALEXANDROVSKY_GARDEN,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs0BX_Xl6HB86vpbAauF0caAtmnipM3sfOHg&s',
	},
	{
		id: 'img-route-7777',
		routeId: ROUTE_UUIDS.SWITZERLAND_PARK,
		imagePath:
			'https://www.niann.ru/_data/objects/0059/7115/icon.jpg?1696256476',
	},
	{
		id: 'img-route-8888',
		routeId: ROUTE_UUIDS.CABLE_CAR,
		imagePath:
			'https://s0.rbk.ru/v6_top_pics/media/img/1/77/346842208473771.jpg',
	},
	{
		id: 'img-route-9999',
		routeId: ROUTE_UUIDS.ROZHDESTVENSKAYA,
		imagePath: 'https://nn-grad.ru/images/places/big/8rozhdestv.jpg',
	},
	{
		id: 'img-route-aaaa',
		routeId: ROUTE_UUIDS.PECHERSKY_MONASTERY,
		imagePath:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3dBq9z2MYMaxEp7JcwWCsJhDRvwjx5GnQDw&s',
	},
	{
		id: 'img-route-bbbb',
		routeId: ROUTE_UUIDS.SORMOVSKY_PARK,
		imagePath:
			'https://avatars.mds.yandex.net/get-altay/9742646/2a0000018903708f459ea059b28152d8eea1/L_height',
	},
	{
		id: 'img-route-cccc',
		routeId: ROUTE_UUIDS.MYZA,
		imagePath:
			'https://cdn.culture.ru/images/8be1f520-6c45-5820-aec2-39574779a0db',
	},
];

export const mockRoutes: Route[] = [
	mockRouteKremlin,
	mockRoutePokrovskaya,
	mockRouteFedorovskogo,
	mockRouteChkalovStairs,
	mockRouteStrelka,
	mockRouteAlexandrovskyGarden,
	mockRouteSwitzerlandPark,
	mockRouteCableCar,
	mockRouteRozhdestvenskaya,
	mockRoutePecherskyMonastery,
	mockRouteSormovskyPark,
	mockRouteMyza,
];

export const getMockRouteById = (id: string): Route | undefined => {
	return mockRoutes.find((route) => route.id === id);
};

export const getRandomMockRoute = (): Route => {
	const randomIndex = Math.floor(Math.random() * mockRoutes.length);
	return mockRoutes[randomIndex];
};

export const getMockRoutesByTag = (tagId: string): Route[] => {
	return mockRoutes.filter((route) =>
		route.tags?.some((tag) => tag.id === tagId)
	);
};

export const getMockRoutesByTagLabel = (tagLabel: string): Route[] => {
	return mockRoutes.filter((route) =>
		route.tags?.some((tag) =>
			tag.label.toLowerCase().includes(tagLabel.toLowerCase())
		)
	);
};

export const searchMockRoutes = (query: string): Route[] => {
	const lowerQuery = query.toLowerCase();
	return mockRoutes.filter((route) =>
		route.name.toLowerCase().includes(lowerQuery)
	);
};

export const getRouteImage = (routeId: string): string | undefined => {
	const image = mockRouteImages.find((img) => img.routeId === routeId);
	return image?.imagePath;
};
