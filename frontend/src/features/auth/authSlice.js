import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadUserFromStorage = () => {
    try {
        const serializedUser = localStorage.getItem('userProfile');
        if (serializedUser === null) {
            return null;
        }
        return JSON.parse(serializedUser);
    } catch (err) {
        console.error('Error loading user from localStorage:', err);
        return null;
    }
};

const initialState = {
    profile: loadUserFromStorage(),
    isLoading: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
            state.isLoading = false;
            // Persist to localStorage
            try {
                localStorage.setItem('userProfile', JSON.stringify(action.payload));
            } catch (err) {
                console.error('Error saving user to localStorage:', err);
            }
        },
        clearProfile: (state) => {
            state.profile = null;
            state.isLoading = false;
            // Remove from localStorage
            try {
                localStorage.removeItem('userProfile');
            } catch (err) {
                console.error('Error removing user from localStorage:', err);
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const selectUserProfile = (state) => state.user.profile;
export const selectIsLoading = (state) => state.user.isLoading;
export const { setProfile, clearProfile, setLoading } = userSlice.actions;
export default userSlice.reducer;
