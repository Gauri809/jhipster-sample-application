package com.eccomerce.mygd.repository;

import com.eccomerce.mygd.domain.Catagory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Catagory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CatagoryRepository extends JpaRepository<Catagory, Long> {}
