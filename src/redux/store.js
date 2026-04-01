import stepReducer from './stepReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: stepReducer, 
});

export { store };
