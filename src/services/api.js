import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}projects`);

    console.log(`Fetched ${response.data.length} projects. Status: ${response.status}`);
    console.log('Projects data:', response.data);

    return response.data;
  } catch (error) {
    console.error('An error occurred while retrieving projects:', error);
    throw error;
  }
};

export const getCertificates = async () => {
  try {
    const response = await axios.get(`${API_URL}certificates`);

    console.log(`Fetched  ${response.data.length} total number of certifications:  ${response.status}`);

    return response.data;
  } catch (error) {
    console.error('An error occurred while retrieving  certificates:', error);
    throw error;
  }
};

export const getCompany = async () => {
  try {
    const response = await axios.get(`${API_URL}companies`);

    console.log(`Fetched  ${response.data.length} total number of companies I have worked:  ${response.status}`);

    return response.data;
  } catch (error) {
    console.error('An error occurred while retrieving companies I have worked for or gained experience from:', error);
    throw error;
  }
};

export const getExperience = async () => {
  try {
    const response = await axios.get(`${API_URL}workhistories`);

    console.log(`Fetched  ${response.data.length} total number of working experience:  ${response.status}`);

    return response.data;
  } catch (error) {
    console.error('Error occurred during the retrieval of work history where I worked:', error);
    throw error;
  }
};
