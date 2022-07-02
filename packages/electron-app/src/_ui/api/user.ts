import axios from "axios";

export default async () => {
    // sleep 500
    await new Promise(res => setTimeout(res, 500));
  
    if (document.cookie.includes("swr-test-token=swr")) {
      // authorized
      return {
        name: "Shu",
        avatar: "https://github.com/shuding.png"
      };
    }
  
    // not authorized
    const error = new Error("Not authorized!");
    error.status = 403;
    throw error;
  };
  