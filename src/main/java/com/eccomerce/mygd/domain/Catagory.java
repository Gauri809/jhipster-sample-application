package com.eccomerce.mygd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Catagory.
 */
@Entity
@Table(name = "catagory")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Catagory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "catagory_id", nullable = false)
    private Long catagoryId;

    @Column(name = "catagory_name")
    private String catagoryName;

    @OneToMany(mappedBy = "catagory")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "title", "discount", "catagory", "catagory" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Catagory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCatagoryId() {
        return this.catagoryId;
    }

    public Catagory catagoryId(Long catagoryId) {
        this.setCatagoryId(catagoryId);
        return this;
    }

    public void setCatagoryId(Long catagoryId) {
        this.catagoryId = catagoryId;
    }

    public String getCatagoryName() {
        return this.catagoryName;
    }

    public Catagory catagoryName(String catagoryName) {
        this.setCatagoryName(catagoryName);
        return this;
    }

    public void setCatagoryName(String catagoryName) {
        this.catagoryName = catagoryName;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        if (this.products != null) {
            this.products.forEach(i -> i.setCatagory(null));
        }
        if (products != null) {
            products.forEach(i -> i.setCatagory(this));
        }
        this.products = products;
    }

    public Catagory products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Catagory addProduct(Product product) {
        this.products.add(product);
        product.setCatagory(this);
        return this;
    }

    public Catagory removeProduct(Product product) {
        this.products.remove(product);
        product.setCatagory(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Catagory)) {
            return false;
        }
        return id != null && id.equals(((Catagory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Catagory{" +
            "id=" + getId() +
            ", catagoryId=" + getCatagoryId() +
            ", catagoryName='" + getCatagoryName() + "'" +
            "}";
    }
}
