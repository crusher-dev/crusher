import { Service } from "typedi";
import axios from "axios";

@Service()
class ProxyService {
    async validateResponse(url: string): Promise<{status, data}> {
        const response = await axios({method: "GET", url, validateStatus: () => true})

        const {status,data}= response
        return {status,data}
    }
}

export { ProxyService };
