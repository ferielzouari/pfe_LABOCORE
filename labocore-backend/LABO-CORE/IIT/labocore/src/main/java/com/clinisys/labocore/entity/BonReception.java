package com.clinisys.labocore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "BonReception", schema = "dbo")
public class BonReception {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numBon", nullable = false, unique = true, length = 50)
    private String numBon;

    @Column(name = "dateBon", nullable = false)
    private LocalDateTime dateBon;

    @Column(name = "codFrs", nullable = false, length = 50)
    private String codFrs;

    @Column(name = "depot", length = 100)
    private String depot;

    public BonReception() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumBon() { return numBon; }
    public void setNumBon(String numBon) { this.numBon = numBon; }

    public LocalDateTime getDateBon() { return dateBon; }
    public void setDateBon(LocalDateTime dateBon) { this.dateBon = dateBon; }

    public String getCodFrs() { return codFrs; }
    public void setCodFrs(String codFrs) { this.codFrs = codFrs; }

    public String getDepot() { return depot; }
    public void setDepot(String depot) { this.depot = depot; }
}
