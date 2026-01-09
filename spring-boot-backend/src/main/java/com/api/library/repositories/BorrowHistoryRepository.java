package com.api.library.repositories;

import com.api.library.entities.BorrowHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BorrowHistoryRepository extends JpaRepository<BorrowHistory, Long> {
    Optional<BorrowHistory> findByBookIsbnAndMemberIdAndReturnedDateIsNull(String isbn, Integer id);
    Page<BorrowHistory> findByMemberId(Integer id, Pageable pageable);
    List<BorrowHistory> findByMemberIdAndReturnedDateIsNull(Integer id);
}
