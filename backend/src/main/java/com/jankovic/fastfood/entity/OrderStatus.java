package com.jankovic.fastfood.entity;

public enum OrderStatus {
    POSLATA,      // Korisnik je poslao narudžbinu
    PRIHVACENA,   // Admin je prihvatio i radi se na njoj
    U_PRIPREMI,   // U toku je priprema
    GOTOVA,       // Spremna za preuzimanje
    ISPORUCENA,   // Isporučena korisniku
    OTKAZANA      // Otkazana narudžbina
}
