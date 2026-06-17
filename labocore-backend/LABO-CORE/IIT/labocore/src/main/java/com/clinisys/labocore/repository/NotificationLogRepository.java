package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    List<NotificationLog> findAllByOrderBySentAtDesc();

    boolean existsByCodartAndSentAtAfter(String codart, LocalDateTime cutoff);
}
