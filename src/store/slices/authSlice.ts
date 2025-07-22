import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'Admin' | 'Editor' | 'Viewer';
export type Permission = 'create' | 'read' | 'update' | 'delete';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  permissions: Permission[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  permissions: [],
};

const getRolePermissions = (role: UserRole): Permission[] => {
  switch (role) {
    case 'Admin':
      return ['create', 'read', 'update', 'delete'];
    case 'Editor':
      return ['create', 'read', 'update'];
    case 'Viewer':
      return ['read'];
    default:
      return [];
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.permissions = getRolePermissions(action.payload.role);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.permissions = [];
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;