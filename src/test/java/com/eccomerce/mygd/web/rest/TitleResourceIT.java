package com.eccomerce.mygd.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.eccomerce.mygd.IntegrationTest;
import com.eccomerce.mygd.domain.Title;
import com.eccomerce.mygd.repository.TitleRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TitleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TitleResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_HEIGHT = 1D;
    private static final Double UPDATED_HEIGHT = 2D;

    private static final Double DEFAULT_WIDTH = 1D;
    private static final Double UPDATED_WIDTH = 2D;

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    private static final String ENTITY_API_URL = "/api/titles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TitleRepository titleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTitleMockMvc;

    private Title title;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Title createEntity(EntityManager em) {
        Title title = new Title().description(DEFAULT_DESCRIPTION).height(DEFAULT_HEIGHT).width(DEFAULT_WIDTH).weight(DEFAULT_WEIGHT);
        return title;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Title createUpdatedEntity(EntityManager em) {
        Title title = new Title().description(UPDATED_DESCRIPTION).height(UPDATED_HEIGHT).width(UPDATED_WIDTH).weight(UPDATED_WEIGHT);
        return title;
    }

    @BeforeEach
    public void initTest() {
        title = createEntity(em);
    }

    @Test
    @Transactional
    void createTitle() throws Exception {
        int databaseSizeBeforeCreate = titleRepository.findAll().size();
        // Create the Title
        restTitleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(title)))
            .andExpect(status().isCreated());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeCreate + 1);
        Title testTitle = titleList.get(titleList.size() - 1);
        assertThat(testTitle.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTitle.getHeight()).isEqualTo(DEFAULT_HEIGHT);
        assertThat(testTitle.getWidth()).isEqualTo(DEFAULT_WIDTH);
        assertThat(testTitle.getWeight()).isEqualTo(DEFAULT_WEIGHT);
    }

    @Test
    @Transactional
    void createTitleWithExistingId() throws Exception {
        // Create the Title with an existing ID
        title.setId(1L);

        int databaseSizeBeforeCreate = titleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTitleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(title)))
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTitles() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        // Get all the titleList
        restTitleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(title.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].height").value(hasItem(DEFAULT_HEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].width").value(hasItem(DEFAULT_WIDTH.doubleValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    void getTitle() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        // Get the title
        restTitleMockMvc
            .perform(get(ENTITY_API_URL_ID, title.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(title.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.height").value(DEFAULT_HEIGHT.doubleValue()))
            .andExpect(jsonPath("$.width").value(DEFAULT_WIDTH.doubleValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingTitle() throws Exception {
        // Get the title
        restTitleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTitle() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        int databaseSizeBeforeUpdate = titleRepository.findAll().size();

        // Update the title
        Title updatedTitle = titleRepository.findById(title.getId()).get();
        // Disconnect from session so that the updates on updatedTitle are not directly saved in db
        em.detach(updatedTitle);
        updatedTitle.description(UPDATED_DESCRIPTION).height(UPDATED_HEIGHT).width(UPDATED_WIDTH).weight(UPDATED_WEIGHT);

        restTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTitle.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTitle))
            )
            .andExpect(status().isOk());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
        Title testTitle = titleList.get(titleList.size() - 1);
        assertThat(testTitle.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTitle.getHeight()).isEqualTo(UPDATED_HEIGHT);
        assertThat(testTitle.getWidth()).isEqualTo(UPDATED_WIDTH);
        assertThat(testTitle.getWeight()).isEqualTo(UPDATED_WEIGHT);
    }

    @Test
    @Transactional
    void putNonExistingTitle() throws Exception {
        int databaseSizeBeforeUpdate = titleRepository.findAll().size();
        title.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, title.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTitle() throws Exception {
        int databaseSizeBeforeUpdate = titleRepository.findAll().size();
        title.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTitle() throws Exception {
        int databaseSizeBeforeUpdate = titleRepository.findAll().size();
        title.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(title)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTitleWithPatch() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        int databaseSizeBeforeUpdate = titleRepository.findAll().size();

        // Update the title using partial update
        Title partialUpdatedTitle = new Title();
        partialUpdatedTitle.setId(title.getId());

        partialUpdatedTitle.height(UPDATED_HEIGHT);

        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTitle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTitle))
            )
            .andExpect(status().isOk());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
        Title testTitle = titleList.get(titleList.size() - 1);
        assertThat(testTitle.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTitle.getHeight()).isEqualTo(UPDATED_HEIGHT);
        assertThat(testTitle.getWidth()).isEqualTo(DEFAULT_WIDTH);
        assertThat(testTitle.getWeight()).isEqualTo(DEFAULT_WEIGHT);
    }

    @Test
    @Transactional
    void fullUpdateTitleWithPatch() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        int databaseSizeBeforeUpdate = titleRepository.findAll().size();

        // Update the title using partial update
        Title partialUpdatedTitle = new Title();
        partialUpdatedTitle.setId(title.getId());

        partialUpdatedTitle.description(UPDATED_DESCRIPTION).height(UPDATED_HEIGHT).width(UPDATED_WIDTH).weight(UPDATED_WEIGHT);

        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTitle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTitle))
            )
            .andExpect(status().isOk());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
        Title testTitle = titleList.get(titleList.size() - 1);
        assertThat(testTitle.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTitle.getHeight()).isEqualTo(UPDATED_HEIGHT);
        assertThat(testTitle.getWidth()).isEqualTo(UPDATED_WIDTH);
        assertThat(testTitle.getWeight()).isEqualTo(UPDATED_WEIGHT);
    }

    @Test
    @Transactional
    void patchNonExistingTitle() throws Exception {
        int databaseSizeBeforeUpdate = titleRepository.findAll().size();
        title.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, title.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTitle() throws Exception {
        int databaseSizeBeforeUpdate = titleRepository.findAll().size();
        title.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTitle() throws Exception {
        int databaseSizeBeforeUpdate = titleRepository.findAll().size();
        title.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(title)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Title in the database
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTitle() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        int databaseSizeBeforeDelete = titleRepository.findAll().size();

        // Delete the title
        restTitleMockMvc
            .perform(delete(ENTITY_API_URL_ID, title.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Title> titleList = titleRepository.findAll();
        assertThat(titleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
