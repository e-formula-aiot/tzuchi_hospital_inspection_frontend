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
  getOrg: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}org/`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getCategory: (organisationId) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}category/?organisation_id=${organisationId}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getTask: (
    organisationId,
    categoryId,
    inspectionTimeStart,
    inspectionTimeEnd,
  ) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}task/status/?organisation_id=${organisationId}&category_id=${categoryId}&inspection_time_start=${inspectionTimeStart}&inspection_time_end=${inspectionTimeEnd}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getHistory: (
    organisationId,
    categoryId,
    inspectionTimeStart,
    inspectionTimeEnd,
  ) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}task/history/?organisation_id=${organisationId}&category_id=${categoryId}&inspection_time_start=${inspectionTimeStart}&inspection_time_end=${inspectionTimeEnd}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getSummaryByCategory: (
    organisationId,
    inspectionTimeStart,
    inspectionTimeEnd,
  ) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}summary/by_category?organisation_id=${organisationId}&inspection_time_start=${inspectionTimeStart}&inspection_time_end=${inspectionTimeEnd}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putWebAudit: (inspectionHistoryId) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'PUT',
      url: `${process.env.backendUrl}task/web_audit/${inspectionHistoryId}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
};

export default backendService;
