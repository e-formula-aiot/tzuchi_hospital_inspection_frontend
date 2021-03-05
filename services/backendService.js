import axios from 'axios';
import Cookies from 'js-cookie';

const makeAuthorizationHeader = () => `Bearer ${Cookies.get('access_token')}`;

const backendService = {
  getUser: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}user/`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getWhoAmI: (_id) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'GET',
      url: `${process.env.backendUrl}/auth/whoami?_id=${_id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  postAuthLogin: (postData) => {
    const config = {
      // headers: {
      //   Authorization: makeAuthorizationHeader(),
      // },
      method: 'POST',
      url: `${process.env.backendUrl}/auth/login`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getCategory: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}category/`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getTask: (categoryId, inspectionTimeStart, inspectionTimeEnd) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}task/status/?category_id=${categoryId}&inspection_time_start=${inspectionTimeStart}&inspection_time_end=${inspectionTimeEnd}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getHistory: (categoryId, inspectionTimeStart, inspectionTimeEnd) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}task/history/?category_id=${categoryId}&inspection_time_start=${inspectionTimeStart}&inspection_time_end=${inspectionTimeEnd}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  // putHistory: () => {
  //   const config = {
  //     method: 'PUT',
  //     url: `${process.env.backendUrl}history.php`,
  //     dataType: 'json',
  //     contentType: 'application/json',
  //   };
  //   return axios(config);
  // },
};

export default backendService;
