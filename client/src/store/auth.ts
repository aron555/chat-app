import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignInResponse, User } from './types';
import axios from 'axios';

export interface AuthState {
  user: User | null;
  isLogged: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogged: false,
};

const API_HOST = process.env.REACT_APP_API_HOST || 'http://chat.test';

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ username: string; password: string }>) => {
      axios
        .post<SignInResponse>(API_HOST + '/api/auth/sign-in', action.payload)
        .then((response) => {
          console.log(response);

          const data = response.data.data;

          if (!data.jwt) return;

          // Need to implement async to redux, use redux-thunk
          // state.isLogged = true;

          localStorage.setItem('token', data.jwt);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    signUp: (state, action: PayloadAction<{ username: string; password: string }>) => {
      axios
        .post(API_HOST + '/api/auth/sign-up', action.payload)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    restoreSessionWithJwt: (state, action: PayloadAction<{ token: string }>) => {
      console.log('restore session with jwt', action.payload.token);

      // TODO: Fetch /me
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.isLogged = false;
    },
  },
});

export const { signIn, signUp, restoreSessionWithJwt, logout } = authSlice.actions;

export default authSlice.reducer;
