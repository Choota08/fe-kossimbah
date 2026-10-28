import axios from './axios';

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

// Login
export const login = (data: {
  email: string;
  password: string;
}) => {
  return axios.post('/login', data);
};

// Logout
export const logout = () => {
  return axios.post('/logout');
};

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

// Ambil profile user login
export const getProfile = () => {
  return axios.get('/profile');
};

// Update nama & phone
export const updateProfile = (data: {
  name: string | null;
  phone: string | null;
}) => {
  return axios.put('/profile', data);
};

// Upload avatar
export const uploadAvatar = (formData: FormData) => {
  return axios.post('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
