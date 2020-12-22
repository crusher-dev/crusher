import { BaseRowInterface } from "./BaseRowInterface";
import { ServiceProvider } from "../ServiceProvider";

export interface UserProviderConnection extends BaseRowInterface {
	id?: number;
	user_id: number;
	provider: ServiceProvider;
	provider_user_id?: string;
	access_token: string;
}
