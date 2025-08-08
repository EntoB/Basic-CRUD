import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Employee {
    id: number;
    name: string;
    dateOfBirth: string;
    departmentId: number;
}

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (_, { getState }) => {
        const { filters } = (getState() as RootState).employees;
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null) {
                params.append(key, value as string);
            }
        });
        const res = await fetch(`http://localhost:5000/employees/get?${params.toString()}`);
        return await res.json();
    }
);

export const addEmployee = createAsyncThunk(
    'employees/addEmployee',
    async (employee: Omit<Employee, 'id'>, { dispatch }) => {
        await fetch('http://localhost:5000/employees/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee),
        });
        dispatch(fetchEmployees());
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async ({ id, ...employee }: Employee, { dispatch }) => {
        await fetch(`http://localhost:5000/employees/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee),
        });
        dispatch(fetchEmployees());
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async (id: number, { dispatch }) => {
        await fetch(`http://localhost:5000/employees/delete/${id}`, {
            method: 'DELETE',
        });
        dispatch(fetchEmployees());
    }
);

const employeesSlice = createSlice({
    name: 'employees',
    initialState: {
        items: [] as Employee[],
        loading: false,
        error: null as string | null,
        filters: {
            departmentId: null,
            minAge: null,
            maxAge: null,
            search: '',
            page: 1,
            pageSize: 10,
        },
        total: 0,
    },
    reducers: {
        setDepartmentId(state, action) { state.filters.departmentId = action.payload; },
        setMinAge(state, action) { state.filters.minAge = action.payload; },
        setMaxAge(state, action) { state.filters.maxAge = action.payload; },
        setSearch(state, action) { state.filters.search = action.payload; },
        setPage(state, action) { state.filters.page = action.payload; },
        setPageSize(state, action) { state.filters.pageSize = action.payload; },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEmployees.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});

export default employeesSlice.reducer;
export const { setDepartmentId, setMinAge, setMaxAge, setSearch, setPage, setPageSize } = employeesSlice.actions;