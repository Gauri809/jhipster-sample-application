package com.eccomerce.mygd.service;

import com.eccomerce.mygd.domain.Catagory;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Catagory}.
 */
public interface CatagoryService {
    /**
     * Save a catagory.
     *
     * @param catagory the entity to save.
     * @return the persisted entity.
     */
    Catagory save(Catagory catagory);

    /**
     * Updates a catagory.
     *
     * @param catagory the entity to update.
     * @return the persisted entity.
     */
    Catagory update(Catagory catagory);

    /**
     * Partially updates a catagory.
     *
     * @param catagory the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Catagory> partialUpdate(Catagory catagory);

    /**
     * Get all the catagories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Catagory> findAll(Pageable pageable);

    /**
     * Get the "id" catagory.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Catagory> findOne(Long id);

    /**
     * Delete the "id" catagory.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
