import axios from 'axios';
const token = "";
axios.defaults.baseURL = 'http://localhost:1010/'
axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
export default axios;