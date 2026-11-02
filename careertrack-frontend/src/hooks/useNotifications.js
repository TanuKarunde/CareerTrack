
import { useCallback, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../services/notificationService";

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        try {
            const [notificationResponse, countResponse] =
                await Promise.all([
                    getNotifications(),
                    getUnreadNotificationCount(),
                ]);

            const items = Array.isArray(notificationResponse)
                ? notificationResponse
                : notificationResponse?.content ?? [];

            setNotifications(items);

            const count =
                typeof countResponse === "number"
                    ? countResponse
                    : countResponse?.count ??
                      countResponse?.unreadCount ??
                      0;

            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("careertrack_token");

        if (!token) {
            console.warn(
                "Notifications WebSocket: JWT token not found in localStorage."
            );
            return;
        }

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",

            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            reconnectDelay: 5000,
            connectionTimeout: 10000,
            debug: (message) => {
                console.log("[STOMP]", message);
            },

            onConnect: () => {
                console.log("Notifications WebSocket connected.");
                setConnected(true);

                client.subscribe(
                    "/user/queue/notifications",
                    (message) => {
                        try {
                            const notification = JSON.parse(message.body);

                            setNotifications((previous) => {
                                if (
                                    previous.some(
                                        (item) => item.id === notification.id
                                    )
                                ) {
                                    return previous;
                                }

                                return [notification, ...previous];
                            });

                            if (!notification.read) {
                                setUnreadCount((previous) => previous + 1);
                            }
                        } catch (error) {
                            console.error(
                                "Invalid notification message:",
                                error
                            );
                        }
                    }
                );

                // Refresh persisted notifications after connection.
                loadNotifications();
            },

            onDisconnect: () => {
                setConnected(false);
            },

            onWebSocketClose: (event) => {
                setConnected(false);
                console.error(
                    "Notifications WebSocket closed:",
                    event.code,
                    event.reason
                );
            },

            onWebSocketError: (event) => {
                console.error("Notifications WebSocket error:", event);
            },

            onStompError: (frame) => {
                console.error(
                    "STOMP broker error:",
                    frame.headers,
                    frame.body
                );
            },
        });

        client.activate();

        return () => {
            setConnected(false);
            client.deactivate();
        };
    }, [loadNotifications]);

    const markAsRead = async (id) => {
        const notification = notifications.find(
            (item) => item.id === id
        );

        if (!notification || notification.read) return;

        try {
            await markNotificationAsRead(id);

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === id ? { ...item, read: true } : item
                )
            );

            setUnreadCount((previous) => Math.max(0, previous - 1));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            await markAllNotificationsAsRead();

            setNotifications((previous) =>
                previous.map((item) => ({ ...item, read: true }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const removeNotification = async (id) => {
        try {
            await deleteNotification(id);

            const notification = notifications.find(
                (item) => item.id === id
            );

            setNotifications((previous) =>
                previous.filter((item) => item.id !== id)
            );

            if (notification && !notification.read) {
                setUnreadCount((previous) =>
                    Math.max(0, previous - 1)
                );
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    return {
        notifications,
        unreadCount,
        connected,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
    };
};

export default useNotifications;
