import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteType } from '../../../types/Route';

export type TCheckpointDraft = {
	latitude: number;
	longitude: number;
	landmarkId: string;
	landmarkSearch: string;
};

export interface RouteDraftState {
	title: string;
	description: string;
	type: RouteType;
	difficulty: number;
	lengthMeters: number;
	estimatedTimeMinutes: number;
	city: string;
	selectedTags: string[];
	checkpoints: TCheckpointDraft[];
	isModalOpen: boolean;
}

const initialState: RouteDraftState = {
	title: '',
	description: '',
	type: 'TOURIST',
	difficulty: 1,
	lengthMeters: 0,
	estimatedTimeMinutes: 0,
	city: '',
	selectedTags: [],
	checkpoints: [],
	isModalOpen: false,
};

const routeDraftSlice = createSlice({
	name: 'routeDraft',
	initialState,
	reducers: {
		setDraft: (state, action: PayloadAction<Partial<RouteDraftState>>) => {
			Object.assign(state, action.payload);
		},

		setCheckpoints: (state, action: PayloadAction<TCheckpointDraft[]>) => {
			state.checkpoints = action.payload;
		},

		addCheckpoint: (state) => {
			state.checkpoints.push({
				latitude: 0,
				longitude: 0,
				landmarkId: '',
				landmarkSearch: '',
			});
		},

		removeCheckpoint: (state, action: PayloadAction<number>) => {
			state.checkpoints = state.checkpoints.filter(
				(_, index) => index !== action.payload
			);
		},

		updateCheckpoint: (
			state,
			action: PayloadAction<{
				index: number;
				field: keyof TCheckpointDraft;
				value: string | number;
			}>
		) => {
			const { index, field, value } = action.payload;

			if (!state.checkpoints[index]) return;

			state.checkpoints[index] = {
				...state.checkpoints[index],
				[field]: value,
			};
		},

		setModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isModalOpen = action.payload;
		},

		clearDraft: () => initialState,
	},
});

export const {
	setDraft,
	setCheckpoints,
	addCheckpoint,
	removeCheckpoint,
	updateCheckpoint,
	setModalOpen,
	clearDraft,
} = routeDraftSlice.actions;

export default routeDraftSlice.reducer;
