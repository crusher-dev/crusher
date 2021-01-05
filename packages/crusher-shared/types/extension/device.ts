export interface iDevice {
	id: string;
	name: string;
	width: number;
	height: number;
	visible: boolean;
	mobile?: boolean;
	userAgent: string;
};
