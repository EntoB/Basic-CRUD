import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',
    async (_, { getState }) => {
        const { filters } = (getState() as RootState).departments;
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== '') params.append(key, value as string);
        });
        const res = await fetch(`http://localhost:5000/departments/get?${params.toString()}`);
        return await res.json();
    }
);

const departmentsSlice = createSlice({
    name: 'departments',
    initialState: {
        items: [],
        loading: false,
        error: null as string | null,
        filters: {
            parentId: null,
            minEmployees: null,
            maxEmployees: null,
            search: '',
            page: 1,
            pageSize: 10,
        },
        total: 0,
    },
    reducers: {
        setParentId(state, action) { state.filters.parentId = action.payload; },
        setMinEmployees(state, action) { state.filters.minEmployees = action.payload; },
        setMaxEmployees(state, action) { state.filters.maxEmployees = action.payload; },
        setSearch(state, action) { state.filters.search = action.payload; },
        setPage(state, action) { state.filters.page = action.payload; },
        setPageSize(state, action) { state.filters.pageSize = action.payload; },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchDepartments.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});

export default departmentsSlice.reducer;
export const { setParentId, setMinEmployees, setMaxEmployees, setSearch, setPage, setPageSize } = departmentsSlice.actions;