package com.eccomerce.mygd.service;

import com.eccomerce.mygd.domain.Title;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Title}.
 */
public interface TitleService {
    /**
     * Save a title.
     *
     * @param title the entity to save.
     * @return the persisted entity.
     */
    Title save(Title title);

    /**
     * Updates a title.
     *
     * @param title the entity to update.
     * @return the persisted entity.
     */
    Title update(Title title);

    /**
     * Partially updates a title.
     *
     * @param title the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Title> partialUpdate(Title title);

    /**
     * Get all the titles.
     *
     * @return the list of entities.
     */
    List<Title> findAll();

    /**
     * Get the "id" title.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Title> findOne(Long id);

    /**
     * Delete the "id" title.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
