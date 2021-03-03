import axios from 'axios';

const backendService = {
  getBaseUser: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}baseUser.php`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getBaseUserById: (id) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}baseUser.php?id=${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putBaseUser: (postData) => {
    const config = {
      method: 'PUT',
      url: `${process.env.backendUrl}baseUser.php`,
      data: postData,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getHistory: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}history.php`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  putHistory: () => {
    const config = {
      method: 'PUT',
      url: `${process.env.backendUrl}history.php`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getGift: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}gift.php`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getGiftById: (id) => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}gift.php?id=${id}`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
  getExportCSV: () => {
    const config = {
      method: 'GET',
      url: `${process.env.backendUrl}ExportCSV.php`,
      dataType: 'json',
      contentType: 'application/json',
    };
    return axios(config);
  },
};

export default backendService;
