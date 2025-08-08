import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './departmentsSlice';
import employeesReducer from './employeesSlice';

export const store = configureStore({
    reducer: {
        departments: departmentsReducer,
        employees: employeesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;