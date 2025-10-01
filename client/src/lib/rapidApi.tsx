import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://youtube138.p.rapidapi.com"   

 const options = {

	headers: {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': 'youtube138.p.rapidapi.com'
	}
};

export const fetchData = async(url: string)=>{
    try {
      const {data} =  await axios.get(`${BASE_URL}/${url}`, options);
      console.log(data,"data not found ")
       return data
       
      return data
    } catch (error) {
        console.log(error, "error fetching api key");
        throw error;
    }
}