package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Automate_labo", schema = "dbo")
public class AutomateLabo {

    @Id
    @Column(name = "code_automate")
    private String codeAutomate;

    @Column(name = "designation")
    private String designation;

    public AutomateLabo() {}

    public String getCodeAutomate() { return codeAutomate; }
    public void setCodeAutomate(String codeAutomate) { this.codeAutomate = codeAutomate; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
}