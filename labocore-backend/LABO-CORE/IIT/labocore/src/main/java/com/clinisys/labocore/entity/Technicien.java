package com.clinisys.labocore.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Technicien", schema = "dbo")
public class Technicien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "matricule", nullable = false, unique = true, length = 50)
    private String matricule;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;

    @Column(name = "specialite", length = 100)
    private String specialite;

    @Column(name = "telephone", length = 50)
    private String telephone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "service", length = 100)
    private String service;

    @Column(name = "actif")
    private Boolean actif = true;

    @Column(name = "dateEntree")
    private LocalDate dateEntree;

    public Technicien() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public LocalDate getDateEntree() { return dateEntree; }
    public void setDateEntree(LocalDate dateEntree) { this.dateEntree = dateEntree; }
}
