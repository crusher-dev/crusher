const jwt = require("jsonwebtoken");
const SECRET = process.env.AUTH_SECRET || "U#a03NM3_rVQ!z!:st#k}Gg.PzmUy[l)w.kg6QDR:|t(pVYHOMyX8z:xT<%-3";

const CryptoJS = require("crypto-js");
// Generate a token for 365 days
export const generateToken = (user_id, team_id, time = "365d") => {
	const token = jwt.sign({ user_id, team_id }, SECRET, { expiresIn: time });
	return token;
};

export const generateJWT = (data, time = "2d") => {
	const token = jwt.sign(data, SECRET, { expiresIn: time });
	return token;
};

export const decodeToken = (token) => {
	const decoded = jwt.verify(token, SECRET);
	return decoded;
};

export function encryptPassword(password: string) {
	// User secret as salt later on
	return CryptoJS.MD5(password).toString();
}

export function clearAuthCookies(res) {
	res.clearCookie("token");
	res.clearCookie("isLoggedIn");
}

export function generateVerificationCode(user_id, email) {
	const token = jwt.sign({ user_id, email }, SECRET, { expiresIn: "48h" });
	return token;
}
