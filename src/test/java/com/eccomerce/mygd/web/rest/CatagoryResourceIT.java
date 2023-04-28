package com.eccomerce.mygd.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.eccomerce.mygd.IntegrationTest;
import com.eccomerce.mygd.domain.Catagory;
import com.eccomerce.mygd.repository.CatagoryRepository;
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
 * Integration tests for the {@link CatagoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CatagoryResourceIT {

    private static final Long DEFAULT_CATAGORY_ID = 1L;
    private static final Long UPDATED_CATAGORY_ID = 2L;

    private static final String DEFAULT_CATAGORY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CATAGORY_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/catagories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CatagoryRepository catagoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCatagoryMockMvc;

    private Catagory catagory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Catagory createEntity(EntityManager em) {
        Catagory catagory = new Catagory().catagoryId(DEFAULT_CATAGORY_ID).catagoryName(DEFAULT_CATAGORY_NAME);
        return catagory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Catagory createUpdatedEntity(EntityManager em) {
        Catagory catagory = new Catagory().catagoryId(UPDATED_CATAGORY_ID).catagoryName(UPDATED_CATAGORY_NAME);
        return catagory;
    }

    @BeforeEach
    public void initTest() {
        catagory = createEntity(em);
    }

    @Test
    @Transactional
    void createCatagory() throws Exception {
        int databaseSizeBeforeCreate = catagoryRepository.findAll().size();
        // Create the Catagory
        restCatagoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catagory)))
            .andExpect(status().isCreated());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeCreate + 1);
        Catagory testCatagory = catagoryList.get(catagoryList.size() - 1);
        assertThat(testCatagory.getCatagoryId()).isEqualTo(DEFAULT_CATAGORY_ID);
        assertThat(testCatagory.getCatagoryName()).isEqualTo(DEFAULT_CATAGORY_NAME);
    }

    @Test
    @Transactional
    void createCatagoryWithExistingId() throws Exception {
        // Create the Catagory with an existing ID
        catagory.setId(1L);

        int databaseSizeBeforeCreate = catagoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCatagoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catagory)))
            .andExpect(status().isBadRequest());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCatagoryIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = catagoryRepository.findAll().size();
        // set the field null
        catagory.setCatagoryId(null);

        // Create the Catagory, which fails.

        restCatagoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catagory)))
            .andExpect(status().isBadRequest());

        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCatagories() throws Exception {
        // Initialize the database
        catagoryRepository.saveAndFlush(catagory);

        // Get all the catagoryList
        restCatagoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(catagory.getId().intValue())))
            .andExpect(jsonPath("$.[*].catagoryId").value(hasItem(DEFAULT_CATAGORY_ID.intValue())))
            .andExpect(jsonPath("$.[*].catagoryName").value(hasItem(DEFAULT_CATAGORY_NAME)));
    }

    @Test
    @Transactional
    void getCatagory() throws Exception {
        // Initialize the database
        catagoryRepository.saveAndFlush(catagory);

        // Get the catagory
        restCatagoryMockMvc
            .perform(get(ENTITY_API_URL_ID, catagory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(catagory.getId().intValue()))
            .andExpect(jsonPath("$.catagoryId").value(DEFAULT_CATAGORY_ID.intValue()))
            .andExpect(jsonPath("$.catagoryName").value(DEFAULT_CATAGORY_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCatagory() throws Exception {
        // Get the catagory
        restCatagoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCatagory() throws Exception {
        // Initialize the database
        catagoryRepository.saveAndFlush(catagory);

        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();

        // Update the catagory
        Catagory updatedCatagory = catagoryRepository.findById(catagory.getId()).get();
        // Disconnect from session so that the updates on updatedCatagory are not directly saved in db
        em.detach(updatedCatagory);
        updatedCatagory.catagoryId(UPDATED_CATAGORY_ID).catagoryName(UPDATED_CATAGORY_NAME);

        restCatagoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCatagory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCatagory))
            )
            .andExpect(status().isOk());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
        Catagory testCatagory = catagoryList.get(catagoryList.size() - 1);
        assertThat(testCatagory.getCatagoryId()).isEqualTo(UPDATED_CATAGORY_ID);
        assertThat(testCatagory.getCatagoryName()).isEqualTo(UPDATED_CATAGORY_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCatagory() throws Exception {
        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();
        catagory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatagoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, catagory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(catagory))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCatagory() throws Exception {
        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();
        catagory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatagoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(catagory))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCatagory() throws Exception {
        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();
        catagory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatagoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catagory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCatagoryWithPatch() throws Exception {
        // Initialize the database
        catagoryRepository.saveAndFlush(catagory);

        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();

        // Update the catagory using partial update
        Catagory partialUpdatedCatagory = new Catagory();
        partialUpdatedCatagory.setId(catagory.getId());

        restCatagoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCatagory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCatagory))
            )
            .andExpect(status().isOk());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
        Catagory testCatagory = catagoryList.get(catagoryList.size() - 1);
        assertThat(testCatagory.getCatagoryId()).isEqualTo(DEFAULT_CATAGORY_ID);
        assertThat(testCatagory.getCatagoryName()).isEqualTo(DEFAULT_CATAGORY_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCatagoryWithPatch() throws Exception {
        // Initialize the database
        catagoryRepository.saveAndFlush(catagory);

        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();

        // Update the catagory using partial update
        Catagory partialUpdatedCatagory = new Catagory();
        partialUpdatedCatagory.setId(catagory.getId());

        partialUpdatedCatagory.catagoryId(UPDATED_CATAGORY_ID).catagoryName(UPDATED_CATAGORY_NAME);

        restCatagoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCatagory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCatagory))
            )
            .andExpect(status().isOk());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
        Catagory testCatagory = catagoryList.get(catagoryList.size() - 1);
        assertThat(testCatagory.getCatagoryId()).isEqualTo(UPDATED_CATAGORY_ID);
        assertThat(testCatagory.getCatagoryName()).isEqualTo(UPDATED_CATAGORY_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCatagory() throws Exception {
        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();
        catagory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatagoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, catagory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(catagory))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCatagory() throws Exception {
        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();
        catagory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatagoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(catagory))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCatagory() throws Exception {
        int databaseSizeBeforeUpdate = catagoryRepository.findAll().size();
        catagory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatagoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(catagory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Catagory in the database
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCatagory() throws Exception {
        // Initialize the database
        catagoryRepository.saveAndFlush(catagory);

        int databaseSizeBeforeDelete = catagoryRepository.findAll().size();

        // Delete the catagory
        restCatagoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, catagory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Catagory> catagoryList = catagoryRepository.findAll();
        assertThat(catagoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
