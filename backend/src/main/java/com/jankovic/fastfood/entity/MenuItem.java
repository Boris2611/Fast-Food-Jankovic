package com.jankovic.fastfood.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naziv;

    @Column(nullable = false, length = 1000)
    private String opis;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cena;

    @Column(nullable = false)
    private Boolean dostupno;

    @Column(nullable = false)
    private String kategorija;

    @Column(name = "slika_path")
    private String slikaPath;

    // Getters i Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public BigDecimal getCena() {
        return cena;
    }

    public void setCena(BigDecimal cena) {
        this.cena = cena;
    }

    public Boolean getDostupno() {
        return dostupno;
    }

    public void setDostupno(Boolean dostupno) {
        this.dostupno = dostupno;
    }

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(String kategorija) {
        this.kategorija = kategorija;
    }

    public String getSlikaPath() {
        return slikaPath;
    }

    public void setSlikaPath(String slikaPath) {
        this.slikaPath = slikaPath;
    }
}
