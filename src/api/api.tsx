import axios from "axios";

const URL = "https://ccjewllery-backend.onrender.com/api";

// Define a type for the argument
interface PostMethodProps {
  url: string;
  body: any;   // you can replace `any` with your own body type later
}

// Type for the argument
interface GetMethodProps {
  url: string;
}

export const postMethod = async ({ url, body }: PostMethodProps) => {
  try {
    const response = await axios.post(`${URL}${url}`, body);
    return response.data;
  } catch (err: any) {
    console.error("POST Error:", err.response?.data || err.message);
    throw err;
  }
};

export const getMethod = async ({ url }: GetMethodProps) => {
  try {
    const response = await axios.get(`${URL}${url}`);
    return response.data; // return backend response
  } catch (err: any) {
    console.error("GET Error:", err.response?.data || err.message);
    throw err;
  }
};