import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { getProjectConfigPath } from "./projectConfig";

export const getEnvironments = () => {
	const projectConfigPath = getProjectConfigPath();

    const projectDirPath = projectConfigPath.split(path.sep).slice(0, -1).join(path.sep);
    
    const envFiles = fs.readdirSync(projectDirPath).filter((file) => file.includes(".env"));
    
    const envs = envFiles.map((file) => {
        // Remove first .env
        const env = file.split(".").slice(2).join(".");
        const filePath = path.join(projectDirPath, file);

        const envFile = dotenv.parse(fs.readFileSync(filePath));
        
        return {
            name: env,
            path: filePath,
            variables: envFile,
        }
    });

    return envs;
}