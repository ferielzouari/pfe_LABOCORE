package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "FicheSecurite", schema = "dbo")
public class FicheSecurite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "designation")
    private String designation;

    @Column(name = "designation_ANG")
    private String designationAng;


    public FicheSecurite() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDesignationAng() { return designationAng; }
    public void setDesignationAng(String designationAng) { this.designationAng = designationAng; }

}