import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice/userSlice';
import routesReducer from './routeSlice/routeSlice';
import tagReducer from './tagsSlice/tagsSlice'
import landmarkReducer from './landmarkSlice/landmarkSlice';
import audioGuideReducer from './audioGuideSlice/audioGuideSlice';
import fileReducer from './fileSlice/fileSlice';
import friendsReducer from './friendsSlice/friendsSlice';
import profileReducer from './profileSlice/profileSlice';
import gamificationReducer from "./gamificationSlice/gamificationSlice";

export const rootReducer = combineReducers({
	user: userReducer,
	routes: routesReducer,
	tags: tagReducer,
	landmarks: landmarkReducer,
	audioGuides: audioGuideReducer,
	file: fileReducer,
	friends: friendsReducer,
	profile: profileReducer,
	gamification: gamificationReducer,
});
