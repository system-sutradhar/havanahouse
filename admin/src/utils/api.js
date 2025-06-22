import axios from "axios";
import logger from "./logger";

const getHeaders = () => {
  const token = localStorage.getItem("token") || "";
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const handleError = (error) => {
  logger.error(error);
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return error;
};

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(
      process.env.REACT_APP_BASE_URL + url,
      getHeaders()
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const uploadImage = async (url, formData) => {
  try {
    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + url,
      formData,
      getHeaders()
    );
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const postData = async (url, formData) => {
  try {
    const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
      method: "POST",
      headers: getHeaders().headers,
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      return await response.json();
    }
    if (response.status === 401) {
      handleError({ response: { status: 401 } });
    }
    return await response.json();
  } catch (error) {
    return handleError(error);
  }
};

export const editData = async (url, updatedData) => {
  try {
    const { data } = await axios.put(
      `${process.env.REACT_APP_BASE_URL}${url}`,
      updatedData,
      getHeaders()
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteData = async (url) => {
  try {
    const { data } = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}${url}`,
      getHeaders()
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteImages = async (url, image) => {
  try {
    const { data } = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}${url}`,
      {
        ...getHeaders(),
        data: image,
      }
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};
