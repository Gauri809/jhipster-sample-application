package com.eccomerce.mygd.service;

import com.eccomerce.mygd.domain.Discount;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Discount}.
 */
public interface DiscountService {
    /**
     * Save a discount.
     *
     * @param discount the entity to save.
     * @return the persisted entity.
     */
    Discount save(Discount discount);

    /**
     * Updates a discount.
     *
     * @param discount the entity to update.
     * @return the persisted entity.
     */
    Discount update(Discount discount);

    /**
     * Partially updates a discount.
     *
     * @param discount the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Discount> partialUpdate(Discount discount);

    /**
     * Get all the discounts.
     *
     * @return the list of entities.
     */
    List<Discount> findAll();

    /**
     * Get the "id" discount.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Discount> findOne(Long id);

    /**
     * Delete the "id" discount.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
