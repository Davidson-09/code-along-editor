import { configureStore } from '@reduxjs/toolkit'
import currentFileReducer from './features/currentFIle/currentFileSlice'

export const store = configureStore({
  reducer: {
    currentFile: currentFileReducer
  },
})