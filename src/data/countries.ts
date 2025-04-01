
interface Region {
  code: string;
  name: string;
  cities?: string[];
}

export interface CountryData {
  code: string;
  name: string;
  regions: Region[];
  phoneFormat: string;
  phoneRegex: RegExp;
}

export const COUNTRIES: Record<string, CountryData> = {
  PT: {
    code: "PT",
    name: "Portugal",
    phoneFormat: "+351 XXX XXX XXX",
    phoneRegex: /^\+?351?[1-9][0-9]{8}$/,
    regions: [
      { code: "AV", name: "Aveiro", cities: ["Aveiro", "Espinho", "Ovar", "Águeda"] },
      { code: "BE", name: "Beja", cities: ["Beja", "Moura", "Odemira", "Serpa"] },
      { code: "BR", name: "Braga", cities: ["Braga", "Barcelos", "Guimarães", "Vila Nova de Famalicão"] },
      { code: "BA", name: "Bragança", cities: ["Bragança", "Mirandela", "Mogadouro"] },
      { code: "CB", name: "Castelo Branco", cities: ["Castelo Branco", "Covilhã", "Fundão"] },
      { code: "CO", name: "Coimbra", cities: ["Coimbra", "Figueira da Foz", "Lousã"] },
      { code: "EV", name: "Évora", cities: ["Évora", "Estremoz", "Montemor-o-Novo"] },
      { code: "FA", name: "Faro", cities: ["Faro", "Albufeira", "Lagos", "Loulé", "Portimão"] },
      { code: "GU", name: "Guarda", cities: ["Guarda", "Seia", "Trancoso"] },
      { code: "LE", name: "Leiria", cities: ["Leiria", "Caldas da Rainha", "Pombal"] },
      { code: "LI", name: "Lisboa", cities: ["Lisboa", "Amadora", "Cascais", "Loures", "Odivelas", "Oeiras", "Sintra"] },
      { code: "PA", name: "Portalegre", cities: ["Portalegre", "Elvas", "Ponte de Sor"] },
      { code: "PO", name: "Porto", cities: ["Porto", "Gondomar", "Maia", "Matosinhos", "Vila Nova de Gaia"] },
      { code: "SA", name: "Santarém", cities: ["Santarém", "Abrantes", "Tomar", "Torres Novas"] },
      { code: "SE", name: "Setúbal", cities: ["Setúbal", "Almada", "Barreiro", "Seixal"] },
      { code: "VC", name: "Viana do Castelo", cities: ["Viana do Castelo", "Ponte de Lima"] },
      { code: "VR", name: "Vila Real", cities: ["Vila Real", "Chaves", "Peso da Régua"] },
      { code: "VI", name: "Viseu", cities: ["Viseu", "Lamego", "São Pedro do Sul", "Tondela"] },
      { code: "AC", name: "Açores", cities: ["Ponta Delgada", "Angra do Heroísmo", "Horta"] },
      { code: "MA", name: "Madeira", cities: ["Funchal", "Câmara de Lobos", "Santa Cruz"] }
    ]
  },
  IT: {
    code: "IT",
    name: "Italy",
    phoneFormat: "+39 XXX XXX XXXX",
    phoneRegex: /^\+?39?[0-9]{9,10}$/,
    regions: [
      { code: "ABR", name: "Abruzzo", cities: ["L'Aquila", "Pescara", "Chieti", "Teramo"] },
      { code: "BAS", name: "Basilicata", cities: ["Potenza", "Matera"] },
      { code: "CAL", name: "Calabria", cities: ["Catanzaro", "Reggio Calabria", "Cosenza", "Crotone", "Vibo Valentia"] },
      { code: "CAM", name: "Campania", cities: ["Napoli", "Salerno", "Caserta", "Avellino", "Benevento"] },
      { code: "EMR", name: "Emilia-Romagna", cities: ["Bologna", "Modena", "Parma", "Rimini", "Ferrara", "Forlì-Cesena", "Piacenza", "Ravenna", "Reggio Emilia"] },
      { code: "FVG", name: "Friuli-Venezia Giulia", cities: ["Trieste", "Udine", "Pordenone", "Gorizia"] },
      { code: "LAZ", name: "Lazio", cities: ["Roma", "Latina", "Frosinone", "Viterbo", "Rieti"] },
      { code: "LIG", name: "Liguria", cities: ["Genova", "Savona", "La Spezia", "Imperia"] },
      { code: "LOM", name: "Lombardia", cities: ["Milano", "Brescia", "Bergamo", "Como", "Varese", "Monza e Brianza", "Pavia", "Cremona", "Lecco", "Lodi", "Mantova", "Sondrio"] },
      { code: "MAR", name: "Marche", cities: ["Ancona", "Pesaro e Urbino", "Macerata", "Ascoli Piceno", "Fermo"] },
      { code: "MOL", name: "Molise", cities: ["Campobasso", "Isernia"] },
      { code: "PIE", name: "Piemonte", cities: ["Torino", "Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Verbano-Cusio-Ossola", "Vercelli"] },
      { code: "PUG", name: "Puglia", cities: ["Bari", "Taranto", "Foggia", "Lecce", "Brindisi", "Barletta-Andria-Trani"] },
      { code: "SAR", name: "Sardegna", cities: ["Cagliari", "Sassari", "Nuoro", "Oristano", "Sud Sardegna"] },
      { code: "SIC", name: "Sicilia", cities: ["Palermo", "Catania", "Messina", "Siracusa", "Ragusa", "Trapani", "Agrigento", "Caltanissetta", "Enna"] },
      { code: "TOS", name: "Toscana", cities: ["Firenze", "Pisa", "Livorno", "Siena", "Lucca", "Arezzo", "Pistoia", "Massa-Carrara", "Grosseto", "Prato"] },
      { code: "TAA", name: "Trentino-Alto Adige", cities: ["Trento", "Bolzano"] },
      { code: "UMB", name: "Umbria", cities: ["Perugia", "Terni"] },
      { code: "VDA", name: "Valle d'Aosta", cities: ["Aosta"] },
      { code: "VEN", name: "Veneto", cities: ["Venezia", "Verona", "Padova", "Vicenza", "Treviso", "Rovigo", "Belluno"] }
    ]
  },
  ES: {
    code: "ES",
    name: "Spain",
    phoneFormat: "+34 XXX XXX XXX",
    phoneRegex: /^\+?34?[6789][0-9]{8}$/,
    regions: [
      { code: "AND", name: "Andalucía", cities: ["Sevilla", "Málaga", "Granada", "Córdoba", "Cádiz", "Almería", "Jaén", "Huelva"] },
      { code: "ARA", name: "Aragón", cities: ["Zaragoza", "Huesca", "Teruel"] },
      { code: "AST", name: "Asturias", cities: ["Oviedo", "Gijón", "Avilés"] },
      { code: "BAL", name: "Islas Baleares", cities: ["Palma", "Ibiza", "Mahón"] },
      { code: "CAN", name: "Islas Canarias", cities: ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife"] },
      { code: "CAB", name: "Cantabria", cities: ["Santander", "Torrelavega"] },
      { code: "CLM", name: "Castilla-La Mancha", cities: ["Toledo", "Guadalajara", "Albacete", "Ciudad Real", "Cuenca"] },
      { code: "CYL", name: "Castilla y León", cities: ["Valladolid", "Burgos", "Salamanca", "León", "Ávila", "Palencia", "Segovia", "Soria", "Zamora"] },
      { code: "CAT", name: "Cataluña", cities: ["Barcelona", "Girona", "Lleida", "Tarragona"] },
      { code: "CEU", name: "Ceuta", cities: ["Ceuta"] },
      { code: "VAL", name: "Comunidad Valenciana", cities: ["Valencia", "Alicante", "Castellón de la Plana"] },
      { code: "EXT", name: "Extremadura", cities: ["Mérida", "Badajoz", "Cáceres"] },
      { code: "GAL", name: "Galicia", cities: ["Santiago de Compostela", "A Coruña", "Vigo", "Ourense", "Lugo", "Pontevedra"] },
      { code: "RIO", name: "La Rioja", cities: ["Logroño"] },
      { code: "MAD", name: "Madrid", cities: ["Madrid", "Alcalá de Henares", "Móstoles", "Fuenlabrada"] },
      { code: "MEL", name: "Melilla", cities: ["Melilla"] },
      { code: "MUR", name: "Murcia", cities: ["Murcia", "Cartagena", "Lorca"] },
      { code: "NAV", name: "Navarra", cities: ["Pamplona"] },
      { code: "PVA", name: "País Vasco", cities: ["Bilbao", "San Sebastián", "Vitoria-Gasteiz"] }
    ]
  }
};

export function getDefaultCountryByLanguage(language: string): string {
  switch (language) {
    case 'pt': return 'PT';
    case 'it': return 'IT';
    case 'es': return 'ES';
    default: return 'ES';
  }
}

export function getRegionLabel(language: string): string {
  switch (language) {
    case 'pt': return 'Distrito';
    case 'it': return 'Regione';
    case 'es': return 'Provincia';
    default: return 'Province/Region';
  }
}
