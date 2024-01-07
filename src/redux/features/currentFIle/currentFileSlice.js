import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const currentFileSlice = createSlice({
  name: 'current file',
  initialState,
  reducers: {
    changeCurrentFile: (state, action) => {
        state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeCurrentFile } = currentFileSlice.actions

export default currentFileSlice.reducer