import * as React from 'react';
import { styled } from '@stitches/react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { FixToast } from './fixToast';
import mitt from 'mitt';

export const toastEmitter = mitt();
export type ToastType = "step-failed";

export type ToastEvent = {
	message: string;
	type: ToastType;
  isUnique?: boolean;
	meta?: any;
};

export const showToast = (event: ToastEvent) => {
	toastEmitter.emit("show", event);
}

export const clearToast = (eventType: ToastType) => {
  toastEmitter.emit("clear", eventType);
};

const VIEWPORT_PADDING = 25;

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  bottom: "16rem",
  left: "50%",
  display: 'flex',
  flexDirection: 'column',
  padding: VIEWPORT_PADDING,
  gap: 10,
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
  outline: 'none',
});





// Exports
const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = StyledViewport;


const ToastBox = () => {
  const [toasts, setToasts] = React.useState<ToastEvent[]>([]);

  React.useEffect(() => {
    const handler = (event: ToastEvent) => {
      let finalToasts = [...toasts];
      if(event.isUnique) {
        finalToasts = finalToasts.filter(t => t.type !== event.type);
      }
      setToasts((toasts) => [...finalToasts, event]);
    };

    const handleClear = (eventType: ToastType) => {
      setToasts((toasts) => toasts.filter(t => t.type !== eventType));
    };

    toastEmitter.on("show", handler);
    toastEmitter.on("clear", handleClear);
    return () => {
      toastEmitter.off("show", handler);
      toastEmitter.off("clear", handleClear);
    };
  }, []);

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((toast) => (
        <FixToast message={toast.message} />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};

export {ToastBox};