import axios from "axios";
import qs from "qs";

class auth {

    static async getToken() {
        var url = 'http://localhost:8080/protected.php';

        const data = { 'token': 'azerty123' };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url,
        };
        const response = await axios(options);
        console.log(response['data'].status);
        return response['data'].status;
    }

}

export default auth;
