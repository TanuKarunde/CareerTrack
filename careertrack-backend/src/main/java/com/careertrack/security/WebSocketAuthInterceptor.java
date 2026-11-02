
package com.careertrack.security;

import java.util.List;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public WebSocketAuthInterceptor(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        StompCommand command = accessor.getCommand();

        // Authenticate the STOMP connection using the JWT.
        if (StompCommand.CONNECT.equals(command)) {

            List<String> headers =
                    accessor.getNativeHeader("Authorization");

            if (headers == null || headers.isEmpty()
                    || headers.get(0) == null
                    || !headers.get(0).startsWith("Bearer ")) {
                throw new AccessDeniedException(
                        "Missing WebSocket authentication token");
            }

            String token = headers.get(0).substring(7).trim();

            if (token.isEmpty()) {
                throw new AccessDeniedException(
                        "Missing WebSocket authentication token");
            }

            try {
                String email = jwtService.extractUsername(token);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                if (!jwtService.isTokenValid(token, userDetails)) {
                    throw new AccessDeniedException(
                            "Invalid WebSocket authentication token");
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                accessor.setUser(authentication);

            } catch (AccessDeniedException ex) {
                throw ex;
            } catch (Exception ex) {
                throw new AccessDeniedException(
                        "WebSocket authentication failed");
            }
        }

        // Require an authenticated Principal for client messages.
        if (StompCommand.SEND.equals(command)
                || StompCommand.SUBSCRIBE.equals(command)) {

            if (!(accessor.getUser() instanceof Authentication authentication)
                    || !authentication.isAuthenticated()) {
                throw new AccessDeniedException(
                        "Authentication is required for WebSocket messaging");
            }

            String destination = accessor.getDestination();

            if (destination == null) {
                throw new AccessDeniedException(
                        "WebSocket destination is required");
            }

         // Clients must not SEND messages directly to broker destinations.
         // SUBSCRIBE to approved /user/ queues is allowed.
         // Authorize subscriptions to approved destinations only.

            // Authorize subscriptions to approved destinations only.
            if (StompCommand.SUBSCRIBE.equals(command)) {

                boolean allowed =
                        "/user/queue/chat".equals(destination)
                        || "/user/queue/notifications".equals(destination);

                boolean isStudent = authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_STUDENT".equals(
                                        authority.getAuthority()));

                boolean isEmployer = authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_EMPLOYER".equals(
                                        authority.getAuthority()));

                if (isStudent
                        && "/queue/announcements.student".equals(destination)) {
                    allowed = true;
                }

                if (isEmployer
                        && "/queue/announcements.employer".equals(destination)) {
                    allowed = true;
                }

                if (!allowed) {
                    throw new AccessDeniedException(
                            "Subscription to this destination is not allowed");
                }
            }

            // Only the chat send handler is allowed for now.
            if (StompCommand.SEND.equals(command)
                    && !"/app/chat.send".equals(destination)) {
                throw new AccessDeniedException(
                        "Sending to this destination is not allowed");
            }

        }

        return message;
    }
}
