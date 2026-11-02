
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const ChatWebSocketTest = () => {
    const clientRef = useRef(null);

    const [connected, setConnected] = useState(false);
    const [conversationId, setConversationId] = useState("1");
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("careertrack_token");

        if (!token) {
            setError("JWT token not found. Please log in first.");
            return;
        }

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",

            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            reconnectDelay: 5000,

            debug: (message) => {
                console.log("[CHAT STOMP]", message);
            },

            onConnect: () => {
                console.log("Chat WebSocket connected.");
                setConnected(true);
                setError("");

                client.subscribe(
                    "/user/queue/chat",
                    (message) => {
                        try {
                            const received = JSON.parse(message.body);

                            console.log("Chat message received:", received);

                            setMessages((previous) => [
                                ...previous,
                                received,
                            ]);
                        } catch (err) {
                            console.error(
                                "Could not parse chat message:",
                                err
                            );
                        }
                    }
                );
            },

            onDisconnect: () => {
                setConnected(false);
            },

            onWebSocketClose: () => {
                setConnected(false);
            },

            onStompError: (frame) => {
                console.error("Chat STOMP error:", frame);
                setError(
                    frame.headers?.message ||
                    "STOMP connection error. Check the backend logs."
                );
            },

            onWebSocketError: (event) => {
                console.error("Chat WebSocket error:", event);
            },
        });

        clientRef.current = client;
        client.activate();

        return () => {
            clientRef.current = null;
            client.deactivate();
        };
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        const trimmedContent = content.trim();
        const id = Number(conversationId);

        if (!clientRef.current?.connected) {
            setError("WebSocket is not connected.");
            return;
        }

        if (!Number.isInteger(id) || id <= 0) {
            setError("Enter a valid conversation ID.");
            return;
        }

        if (!trimmedContent) {
            setError("Please enter a message.");
            return;
        }

        setError("");

        clientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify({
                conversationId: id,
                content: trimmedContent,
            }),
        });

        setContent("");
    };

    return (
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                    Chat WebSocket Test
                </h2>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        connected
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {connected ? "Connected" : "Disconnected"}
                </span>
            </div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
                Conversation ID
            </label>

            <input
                type="number"
                min="1"
                value={conversationId}
                onChange={(event) =>
                    setConversationId(event.target.value)
                }
                className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
            />

            {error && (
                <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="mb-4 h-80 space-y-3 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                {messages.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No live messages received yet. Send a message
                        from another logged-in student session.
                    </p>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={`${message.id}-${index}`}
                            className="rounded-lg border border-gray-200 bg-white p-3"
                        >
                            <p className="text-sm font-semibold text-purple-700">
                                {message.senderName || "Student"}
                            </p>

                            <p className="mt-1 break-words text-gray-800">
                                {message.content}
                            </p>

                            <p className="mt-2 text-xs text-gray-400">
                                {message.createdAt
                                    ? new Date(
                                          message.createdAt
                                      ).toLocaleString()
                                    : ""}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Type a test message..."
                    maxLength={2000}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                />

                <button
                    type="submit"
                    disabled={!connected}
                    className="rounded-lg bg-purple-600 px-5 py-2 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWebSocketTest;
