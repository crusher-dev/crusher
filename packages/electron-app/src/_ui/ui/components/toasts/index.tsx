import * as React from 'react';
import { styled } from '@stitches/react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { FixToast } from './fixToast';
import mitt from 'mitt';
import { NormalToast } from './normalToast';
import { uuidv4 } from 'runner-utils/src/utils/helper';
import { LoadingToast } from './loadingToast';

export const toastEmitter = mitt();
export type ToastType = "step-failed" | "ready-for-edit" | "normal" | "loading";

export type ToastEvent = {
  id?: string;
	message: string;
	type: ToastType;
  isUnique?: boolean;
	meta?: any;
  duration?: number;
};

export const showToast = (event: ToastEvent) => {
	toastEmitter.emit("show", event);
}

export const clearToast = (eventType: ToastType) => {
  toastEmitter.emit("clear", eventType);
};

export const clearToastId = (id: string) => {
  toastEmitter.emit("clear-id", id);
}

export const clearAllToasts = () => {
  toastEmitter.emit("clear-all-toasts");
}
const VIEWPORT_PADDING = 25;

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  bottom: "16rem",
  left: "calc(50% + 172rem)",
  transform: "translateX(-50%)",
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
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = StyledViewport;


const Toasts = ({toasts}) => {
  const handleClearToastWithId = (id: string, shouldOpen: boolean) => {
    if(!shouldOpen)
    clearToastId(id);
  }

  return (
    <>
       {toasts.map((toast) => {
        if(toast.type === "step-failed") return ( 
        <FixToast key={toast.id} setOpen={handleClearToastWithId.bind(this, toast.id)} meta={toast.meta} message={toast.message} /> );
        if(toast.type === "loading") return (<LoadingToast duration={toast.duration || 7000} key={toast.id} setOpen={handleClearToastWithId.bind(this, toast.id)} message={toast.message} meta={toast.meta} />         );
        return (
         <NormalToast duration={toast.duration || 7000} key={toast.id} setOpen={handleClearToastWithId.bind(this, toast.id)} message={toast.message} meta={toast.meta} /> 
        );
      })}
    </>
  )
}


const ToastBox = () => {
  const [toasts, setToasts] = React.useState<ToastEvent[]>([]);

  React.useEffect(() => {
    const handler = (event: ToastEvent) => {
      let finalToasts = [...toasts];
      if(event.isUnique) {
        finalToasts = finalToasts.filter(t => t.type !== event.type);
      }
      event.id = uuidv4();
      setToasts((toasts) => [...finalToasts, event]);
    };

    const handleClear = (eventType: ToastType) => {
      setToasts((toasts) => toasts.filter(t => t.type !== eventType));
    };

    const handleClearAllToasts = () => {
      setToasts([]);
    }

    const handleClearId = (id: string) => {
      setToasts((toasts) => toasts.filter(t => t.id !== id));
    }

    toastEmitter.on("show", handler);
    toastEmitter.on("clear", handleClear);
    toastEmitter.on("clear-all-toasts", handleClearAllToasts);
    toastEmitter.on("clear-id", handleClearId);

    return () => {
      toastEmitter.off("show", handler);
      toastEmitter.off("clear", handleClear);
      toastEmitter.off("clear-all-toasts", handleClearAllToasts);
      toastEmitter.off("clear-id", handleClearId);
    };
  }, [toasts]);

  return (
    <ToastProvider swipeDirection="right"> 
          <Toasts toasts={toasts}/>
         <ToastViewport />
  </ToastProvider>
  );
};

export {ToastBox};