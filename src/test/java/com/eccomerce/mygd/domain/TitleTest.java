package com.eccomerce.mygd.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.eccomerce.mygd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TitleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Title.class);
        Title title1 = new Title();
        title1.setId(1L);
        Title title2 = new Title();
        title2.setId(title1.getId());
        assertThat(title1).isEqualTo(title2);
        title2.setId(2L);
        assertThat(title1).isNotEqualTo(title2);
        title1.setId(null);
        assertThat(title1).isNotEqualTo(title2);
    }
}
