import axios from 'axios';
import Cookies from 'js-cookie';

const makeAuthorizationHeader = () => `Bearer ${Cookies.get('access_token')}`;

const backendService = {
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
  getUser: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}user/`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getUserById: (id) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}user/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getUserByDeptId: (departmentId) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}user/?department_id=${departmentId}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  postUser: (postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'POST',
      url: `${process.env.backendUrl}user/`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putUserById: (id, postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'PUT',
      url: `${process.env.backendUrl}user/${id}`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  deleteUserById: (id) => {
    const config = {
      method: 'DELETE',
      url: `${process.env.backendUrl}user/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getOrg: () => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'GET',
      url: `${process.env.backendUrl}org/`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getOrgById: (id) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'GET',
      url: `${process.env.backendUrl}org/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  postOrg: (postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'POST',
      url: `${process.env.backendUrl}org/`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putOrgById: (id, postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'PUT',
      url: `${process.env.backendUrl}org/${id}`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  deleteOrgById: (id) => {
    const config = {
      method: 'DELETE',
      url: `${process.env.backendUrl}org/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getCategoryById: (id) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}category/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getDeptById: (id) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'GET',
      url: `${process.env.backendUrl}dept/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getDeptByOrganisationId: (organisationId) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}dept/?organisation_id=${organisationId}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  postDept: (postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'POST',
      url: `${process.env.backendUrl}dept/`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putDeptById: (id, postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'PUT',
      url: `${process.env.backendUrl}dept/${id}`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  deleteDeptById: (id) => {
    const config = {
      method: 'DELETE',
      url: `${process.env.backendUrl}dept/${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getCategoryByOrganisationId: (organisationId) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}category/?organisation_id=${organisationId}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  postCategory: (postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'POST',
      url: `${process.env.backendUrl}category/`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putCategoryById: (id, postData) => {
    const config = {
      headers: {
        Authorization: makeAuthorizationHeader(),
      },
      method: 'PUT',
      url: `${process.env.backendUrl}category/${id}`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  deleteCategoryById: (id) => {
    const config = {
      method: 'DELETE',
      url: `${process.env.backendUrl}category/${id}`,
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
