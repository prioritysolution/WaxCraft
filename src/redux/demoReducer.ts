"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the state
interface User {
  id: number; // Assuming `id` is a number. Adjust if it's a string or another type.
  [key: string]: any; // If users have more properties, you can expand or replace this.
}

interface UserState {
  users: User[];
  loading: boolean;
  error: boolean;
}

// Define the initial state with types
export const initialState: UserState = {
  users: [],
  loading: false,
  error: false,
};

// Create the slice with properly typed actions
const demoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to get users, with a typed payload
    getUser: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = true;
      state.error = false;
    },
  },
});

// Export actions and reducer
export const { getUser } = demoSlice.actions;
export default demoSlice.reducer;
