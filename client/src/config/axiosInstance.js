import axios from "axios";

const BASE_URL="http://localhost:4040"
const axiosInstance=axios.create()

axiosInstance.defaults.baseURL=BASE_URL;

export default axiosInstance;