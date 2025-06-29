import axios from "axios";


export const fetchDataFromApi = async (url) => {
    try {
        const base = process.env.NEXT_PUBLIC_APP_API_URL || "";
        const { data } = await axios.get(base + url);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}




export const postData = async (url, formData) => {
    try {
        const base = process.env.NEXT_PUBLIC_APP_API_URL || "";
        const response = await fetch(base + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
           
            body: JSON.stringify(formData)
        });


        if (response.ok) {
            const data = await response.json();
            //console.log(data)
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.error('Error:', error);
    }

}


export const editData = async (url, updatedData ) => {
    const base = process.env.NEXT_PUBLIC_APP_API_URL || "";
    const { res } = await axios.put(`${base}${url}`,updatedData)
    return res;
}

export const deleteData = async (url ) => {
    const base = process.env.NEXT_PUBLIC_APP_API_URL || "";
    const { res } = await axios.delete(`${base}${url}`)
    return res;
}


export const uploadImage = async (url, formData) => {
    const base = process.env.NEXT_PUBLIC_APP_API_URL || "";
    const { res } = await axios.post(base + url , formData)
    return res;
}


export const deleteImages = async (url,image ) => {
    const base = process.env.NEXT_PUBLIC_APP_API_URL || "";
    const { res } = await axios.delete(`${base}${url}`,image);
    return res;
}