package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Prudence / safety advice (P-phrase / GHS precautionary statement).
 *
 * TABLE ADAPTATION NOTE:
 * Change @Table(name = "conseil_prudence") and column names
 * to the real SQL Server table/columns when available.
 */
@Entity
@Table(name = "conseil_prudence") //schema = "dbo")
public class ConseilPrudence {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "code", length = 20)
    private String code;

    @Column(name = "designation", length = 500)
    private String designation;

    public ConseilPrudence() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}