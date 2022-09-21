import React from "react";

const useBuildNotifications = () => {
    const [notifications, setNotifications] = React.useState([]);
    
    // Hydrate
    React.useEffect(() => {
        if(!localStorage.getItem("buildNotifications")) {
            localStorage.setItem("buildNotifications", JSON.stringify([]));
        }
        const notifications = JSON.parse(localStorage.getItem("buildNotifications"));
        setNotifications(notifications);
    }, []);

    const addNotification = React.useCallback((notification) => {
        setNotifications((notifications) => [...notifications, notification]);
        localStorage.setItem("buildNotifications", JSON.stringify([...notifications, notification]));
    }, [notifications]);
    
    const removeNotification = React.useCallback((notificationId) => {
        setNotifications((notifications) => notifications.filter((n) => n.id !== notificationId));
        localStorage.setItem("buildNotifications", JSON.stringify(notifications.filter((n) => n.id !== notificationId)));
    }, [notifications]);

    const clearNotifications = React.useCallback(() => {
        setNotifications([]);
        localStorage.setItem("buildNotifications", JSON.stringify([]));
    }, []);

    return { notifications, addNotification, removeNotification, clearNotifications };
};

export { useBuildNotifications };