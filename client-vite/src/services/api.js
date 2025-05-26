import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadExcel = async (file, companyId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('companyId', companyId);
  
  const response = await axios.post(`${API_URL}/reports/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getReports = async () => {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data;
};

export const getCompanies = async () => {
  const response = await axios.get(`${API_URL}/companies`);
  return response.data;
}; 