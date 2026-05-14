package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Fournisseur", schema = "dbo")
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "raisonSociale", nullable = false, length = 200)
    private String raisonSociale;

    @Column(name = "telephone", length = 50)
    private String telephone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "adresse", length = 500)
    private String adresse;

    @Column(name = "actif")
    private Boolean actif = true;

    public Fournisseur() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getRaisonSociale() { return raisonSociale; }
    public void setRaisonSociale(String raisonSociale) { this.raisonSociale = raisonSociale; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
