import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters, defaultFilters } from '../../../types/Filters';

interface FilterState {
	filters: Filters;
}

const initialState: FilterState = {
	filters: defaultFilters,
};

const filterSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setFilters(state, action: PayloadAction<Filters>) {
			state.filters = action.payload;
		},

		resetFilters(state) {
			state.filters = defaultFilters;
		},
	},
});

export const { setFilters, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
