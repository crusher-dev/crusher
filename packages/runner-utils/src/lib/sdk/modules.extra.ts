const nodeFetch = require("node-fetch").default;
// This class only exists to allow some node
// modules in webpack "require" context along with recorder & test-runner 
export class NodeExtraModules {
    static modules: {[moduleName: string]: any} = {
        "node-fetch": nodeFetch,
    };    

    static require(moduleName: string) {
        const module = NodeExtraModules.modules[moduleName];
        if(!module) {
            throw new Error(`Module ${moduleName} not found`);
        }

        return module;
    }
};