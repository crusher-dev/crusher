import { snackBarEmitter, SnackbarEvent } from '@ui/containers/common/Snackbar';

export const sendSnackBarEvent = (event: SnackbarEvent)=>{
	snackBarEmitter.emit("snackbar-notify", event)
}