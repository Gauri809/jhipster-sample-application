package com.eccomerce.mygd.service.impl;

import com.eccomerce.mygd.domain.Title;
import com.eccomerce.mygd.repository.TitleRepository;
import com.eccomerce.mygd.service.TitleService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Title}.
 */
@Service
@Transactional
public class TitleServiceImpl implements TitleService {

    private final Logger log = LoggerFactory.getLogger(TitleServiceImpl.class);

    private final TitleRepository titleRepository;

    public TitleServiceImpl(TitleRepository titleRepository) {
        this.titleRepository = titleRepository;
    }

    @Override
    public Title save(Title title) {
        log.debug("Request to save Title : {}", title);
        return titleRepository.save(title);
    }

    @Override
    public Title update(Title title) {
        log.debug("Request to update Title : {}", title);
        return titleRepository.save(title);
    }

    @Override
    public Optional<Title> partialUpdate(Title title) {
        log.debug("Request to partially update Title : {}", title);

        return titleRepository
            .findById(title.getId())
            .map(existingTitle -> {
                if (title.getDescription() != null) {
                    existingTitle.setDescription(title.getDescription());
                }
                if (title.getHeight() != null) {
                    existingTitle.setHeight(title.getHeight());
                }
                if (title.getWidth() != null) {
                    existingTitle.setWidth(title.getWidth());
                }
                if (title.getWeight() != null) {
                    existingTitle.setWeight(title.getWeight());
                }

                return existingTitle;
            })
            .map(titleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Title> findAll() {
        log.debug("Request to get all Titles");
        return titleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Title> findOne(Long id) {
        log.debug("Request to get Title : {}", id);
        return titleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Title : {}", id);
        titleRepository.deleteById(id);
    }
}
