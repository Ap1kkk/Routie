import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice/userSlice';
import routesReducer from './routeSlice/routeSlice';
import achievementsReducer from './achievementsSlice/achievementsSlice';
import tagsReducer from './tagsSlice/tagsSlice';

export const rootReducer = combineReducers({
	user: userReducer,
	routes: routesReducer,
	achievements: achievementsReducer,
	tags: tagsReducer,
});
