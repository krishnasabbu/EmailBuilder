import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EmailTemplate } from '../store/slices/emailEditorSlice';
import { User, Role } from '../store/slices/authSlice';
import { TestResult } from '../store/slices/testsSlice';

const API_BASE_URL = 'http://localhost:3001';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['Template', 'User', 'Role', 'Test', 'Onboard'],
  endpoints: (builder) => ({
    // Template endpoints
    getTemplates: builder.query<EmailTemplate[], void>({
      query: () => '/templates',
      providesTags: ['Template'],
    }),
    getTemplate: builder.query<EmailTemplate, string>({
      query: (id) => `/templates/${id}`,
      providesTags: ['Template'],
    }),
    createTemplate: builder.mutation<EmailTemplate, Partial<EmailTemplate>>({
      query: (template) => ({
        url: '/templates',
        method: 'POST',
        body: {
          ...template,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Template'],
    }),
    updateTemplate: builder.mutation<EmailTemplate, EmailTemplate>({
      query: (template) => ({
        url: `/templates/${template.id}`,
        method: 'PUT',
        body: {
          ...template,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Template'],
    }),
    deleteTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Template'],
    }),

    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, User>({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Role endpoints
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (role) => ({
        url: '/roles',
        method: 'POST',
        body: {
          ...role,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<Role, Role>({
      query: (role) => ({
        url: `/roles/${role.id}`,
        method: 'PUT',
        body: role,
      }),
      invalidatesTags: ['Role'],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    // Test endpoints
    getTests: builder.query<TestResult[], void>({
      query: () => '/tests',
      providesTags: ['Test'],
    }),

    // Alert/Onboard endpoints
    getAlerts: builder.query<any[], void>({
      query: () => '/onboard',
      providesTags: ['Onboard'],
    }),
    getAlert: builder.query<any, string>({
      query: (id) => `/onboard/${id}`,
      providesTags: ['Onboard'],
    }),
    createAlert: builder.mutation<any, any>({
      query: (alertData) => ({
        url: '/onboard',
        method: 'POST',
        body: {
          ...alertData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Onboard'],
    }),
    updateAlert: builder.mutation<any, any>({
      query: (alertData) => ({
        url: `/onboard/${alertData.id}`,
        method: 'PUT',
        body: alertData,
      }),
      invalidatesTags: ['Onboard'],
    }),
    deleteAlert: builder.mutation<void, string>({
      query: (id) => ({
        url: `/onboard/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Onboard'],
    }),
    getJiraData: builder.query<any, string>({
      query: (jiraId) => `/jiraData?jiraId=${jiraId}`,
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetTestsQuery,
  useGetAlertsQuery,
  useGetAlertQuery,
  useCreateAlertMutation,
  useUpdateAlertMutation,
  useDeleteAlertMutation,
  useGetJiraDataQuery,
} = api;