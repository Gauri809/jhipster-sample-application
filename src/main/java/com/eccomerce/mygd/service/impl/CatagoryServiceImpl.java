package com.eccomerce.mygd.service.impl;

import com.eccomerce.mygd.domain.Catagory;
import com.eccomerce.mygd.repository.CatagoryRepository;
import com.eccomerce.mygd.service.CatagoryService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Catagory}.
 */
@Service
@Transactional
public class CatagoryServiceImpl implements CatagoryService {

    private final Logger log = LoggerFactory.getLogger(CatagoryServiceImpl.class);

    private final CatagoryRepository catagoryRepository;

    public CatagoryServiceImpl(CatagoryRepository catagoryRepository) {
        this.catagoryRepository = catagoryRepository;
    }

    @Override
    public Catagory save(Catagory catagory) {
        log.debug("Request to save Catagory : {}", catagory);
        return catagoryRepository.save(catagory);
    }

    @Override
    public Catagory update(Catagory catagory) {
        log.debug("Request to update Catagory : {}", catagory);
        return catagoryRepository.save(catagory);
    }

    @Override
    public Optional<Catagory> partialUpdate(Catagory catagory) {
        log.debug("Request to partially update Catagory : {}", catagory);

        return catagoryRepository
            .findById(catagory.getId())
            .map(existingCatagory -> {
                if (catagory.getCatagoryId() != null) {
                    existingCatagory.setCatagoryId(catagory.getCatagoryId());
                }
                if (catagory.getCatagoryName() != null) {
                    existingCatagory.setCatagoryName(catagory.getCatagoryName());
                }

                return existingCatagory;
            })
            .map(catagoryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Catagory> findAll(Pageable pageable) {
        log.debug("Request to get all Catagories");
        return catagoryRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Catagory> findOne(Long id) {
        log.debug("Request to get Catagory : {}", id);
        return catagoryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Catagory : {}", id);
        catagoryRepository.deleteById(id);
    }
}
