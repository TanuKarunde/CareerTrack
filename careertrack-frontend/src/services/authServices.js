const API_URL = "http://localhost:8080/api/auth";

export const registerUser = async(userData) => {
    const response = await fetch("http://localhost:8080/api/auth/register",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const text = await response.text();

    let data = {};

    if(text){
        try{
            data = JSON.parse(text);
        }catch(error){
            data = {message: text};
        }
    }
    if(!response.ok){
        throw new Error(data.message || `Register failed(${response.status})`);
    }

    return data;
};


export const loginUser = async(loginData) => {
    const response = await fetch("http://localhost:8080/api/auth/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    const text = await response.text();

    let data = {};

    if(text){
        try{
            data = JSON.parse(text);
        }catch(error){
            data = {message : text};
        }
    }

    if(!response.ok){
        throw new Error(data.message || `login failed(${response.status})`);
    }

    if(data.token){
        localStorage.setItem("token",data.token);
    }
    return data;
};