import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice/authSlice';
import routesReducer from './routeSlice/routeSlice';
import tagReducer from './tagsSlice/tagsSlice'
import landmarkReducer from './landmarkSlice/landmarkSlice';
import audioGuideReducer from './audioGuideSlice/audioGuideSlice';
import fileReducer from './fileSlice/fileSlice';
import friendsReducer from './friendsSlice/friendsSlice';
import profileReducer from './profileSlice/profileSlice';
import gamificationReducer from './gamificationSlice/gamificationSlice';
import routeDraftReducer from './routeDraftSlice/routeDraftSlice';

export const rootReducer = combineReducers({
	auth: authReducer,
	routes: routesReducer,
	tags: tagReducer,
	landmarks: landmarkReducer,
	audioGuides: audioGuideReducer,
	file: fileReducer,
	friends: friendsReducer,
	profile: profileReducer,
	gamification: gamificationReducer,
	routeDraft: routeDraftReducer,
});
