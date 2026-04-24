package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mention_risque") //schema = "dbo")
public class MentionRisque {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "designation")
    private String designation;

    public MentionRisque() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}