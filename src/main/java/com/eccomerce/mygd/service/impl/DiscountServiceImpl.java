package com.eccomerce.mygd.service.impl;

import com.eccomerce.mygd.domain.Discount;
import com.eccomerce.mygd.repository.DiscountRepository;
import com.eccomerce.mygd.service.DiscountService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Discount}.
 */
@Service
@Transactional
public class DiscountServiceImpl implements DiscountService {

    private final Logger log = LoggerFactory.getLogger(DiscountServiceImpl.class);

    private final DiscountRepository discountRepository;

    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public Discount save(Discount discount) {
        log.debug("Request to save Discount : {}", discount);
        return discountRepository.save(discount);
    }

    @Override
    public Discount update(Discount discount) {
        log.debug("Request to update Discount : {}", discount);
        return discountRepository.save(discount);
    }

    @Override
    public Optional<Discount> partialUpdate(Discount discount) {
        log.debug("Request to partially update Discount : {}", discount);

        return discountRepository
            .findById(discount.getId())
            .map(existingDiscount -> {
                if (discount.getStartDate() != null) {
                    existingDiscount.setStartDate(discount.getStartDate());
                }
                if (discount.getEndDate() != null) {
                    existingDiscount.setEndDate(discount.getEndDate());
                }
                if (discount.getDiscountPersontage() != null) {
                    existingDiscount.setDiscountPersontage(discount.getDiscountPersontage());
                }

                return existingDiscount;
            })
            .map(discountRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Discount> findAll() {
        log.debug("Request to get all Discounts");
        return discountRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Discount> findOne(Long id) {
        log.debug("Request to get Discount : {}", id);
        return discountRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Discount : {}", id);
        discountRepository.deleteById(id);
    }
}
