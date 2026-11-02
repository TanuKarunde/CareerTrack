
package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.careertrack.entity.ChatConversation;

public interface ChatConversationRepository
        extends JpaRepository<ChatConversation, Long> {

    Optional<ChatConversation>
        findByParticipantOne_IdAndParticipantTwo_Id(
            Long participantOneId,
            Long participantTwoId
        );

    @Query("""
        SELECT c
        FROM ChatConversation c
        WHERE c.participantOne.id = :userId
           OR c.participantTwo.id = :userId
        ORDER BY c.updatedAt DESC
        """)
    List<ChatConversation> findAllByParticipantId(
        @Param("userId") Long userId
    );
}
