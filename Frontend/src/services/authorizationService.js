
import axios from "axios";

export async function validateRole() {
  const response = await axios.get("http://3.214.52.43:8002/validate-role", {
    withCredentials: true, // 
  });
  return response.data;
}
