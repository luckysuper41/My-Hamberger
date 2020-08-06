import axios from 'axios';

const instance = axios.create({
     baseURL: 'https://myhamberger.firebaseio.com/'
});

export default instance;