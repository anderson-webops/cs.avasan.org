// src/api.ts
import axios from "axios";

export const api = axios.create({
	baseURL: "/api",
	headers: {
		"X-Classroom-Request": "1"
	},
	withCredentials: true
});
