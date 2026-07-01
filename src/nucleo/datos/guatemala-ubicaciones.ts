// Datos oficiales: 22 departamentos y 340 municipios (codificación INE Guatemala)
// Fuente base: https://github.com/JuanPabloBC7/Guatemala

export const DEPARTAMENTOS_GUATEMALA: readonly string[] = [
  "Alta Verapaz",
  "Baja Verapaz",
  "Chimaltenango",
  "Chiquimula",
  "El Progreso",
  "Escuintla",
  "Guatemala",
  "Huehuetenango",
  "Izabal",
  "Jalapa",
  "Jutiapa",
  "Petén",
  "Quetzaltenango",
  "Quiché",
  "Retalhuleu",
  "Sacatepéquez",
  "San Marcos",
  "Santa Rosa",
  "Sololá",
  "Suchitepéquez",
  "Totonicapán",
  "Zacapa"
] as const;

export const MUNICIPIOS_POR_DEPARTAMENTO: Readonly<Record<string, readonly string[]>> = {
  "Guatemala": [
    "Amatitlán",
    "Chinautla",
    "Chuarrancho",
    "Fraijanes",
    "Guatemala",
    "Mixco",
    "Palencia",
    "San José del Golfo",
    "San José Pinula",
    "San Juan Sacatepéquez",
    "San Miguel Petapa",
    "San Pedro Ayampuc",
    "San Pedro Sacatepéquez",
    "San Raymundo",
    "Santa Catarina Pinula",
    "Villa Canales",
    "Villa Nueva"
  ],
  "El Progreso": [
    "El Jícaro",
    "Guastatoya",
    "Morazán",
    "San Agustín Acasaguastlán",
    "San Antonio la Paz",
    "San Cristóbal Acasaguastlán",
    "Sanarate",
    "Sansare"
  ],
  "Sacatepéquez": [
    "Alotenango",
    "Antigua Guatemala",
    "Ciudad Vieja",
    "Jocotenango",
    "Magdalena Milpas Altas",
    "Pastores",
    "San Antonio Aguas Calientes",
    "San Bartolomé Milpas Altas",
    "San Lucas Sacatepéquez",
    "San Miguel Dueñas",
    "Santa Catarina Barahona",
    "Santa Lucía Milpas Altas",
    "Santa María de Jesús",
    "Santiago Sacatepéquez",
    "Santo Domingo Xenacoj",
    "Sumpango"
  ],
  "Chimaltenango": [
    "Acatenango",
    "Chimaltenango",
    "El Tejar",
    "Parramos",
    "Patzicía",
    "Patzún",
    "Pochuta",
    "San Andrés Itzapa",
    "San José Poaquil",
    "San Juan Comalapa",
    "San Martín Jilotepeque",
    "Santa Apolonia",
    "Santa Cruz Balanyá",
    "Tecpán Guatemala",
    "Yepocapa",
    "Zaragoza"
  ],
  "Escuintla": [
    "Escuintla",
    "Guanagazapa",
    "Iztapa",
    "La Democracia",
    "La Gomera",
    "Masagua",
    "Nueva Concepción",
    "Palín",
    "San José",
    "San Vicente Pacaya",
    "Santa Lucía Cotzumalguapa",
    "Sipacate",
    "Siquinalá",
    "Tiquisate"
  ],
  "Santa Rosa": [
    "Barberena",
    "Casillas",
    "Chiquimulilla",
    "Cuilapa",
    "Guazacapán",
    "Nueva Santa Rosa",
    "Oratorio",
    "Pueblo Nuevo Viñas",
    "San Juan Tecuaco",
    "San Rafael las Flores",
    "Santa Cruz Naranjo",
    "Santa María Ixhuatán",
    "Santa Rosa de Lima",
    "Taxisco"
  ],
  "Sololá": [
    "Concepción",
    "Nahualá",
    "Panajachel",
    "San Andrés Semetabaj",
    "San Antonio Palopó",
    "San José Chacayá",
    "San Juan la Laguna",
    "San Lucas Tolimán",
    "San Marcos la Laguna",
    "San Pablo la Laguna",
    "San Pedro la Laguna",
    "Santa Catarina Ixtahuacán",
    "Santa Catarina Palopó",
    "Santa Clara la Laguna",
    "Santa Cruz la Laguna",
    "Santa Lucía Utatlán",
    "Santa María Visitación",
    "Santiago Atitlán",
    "Sololá"
  ],
  "Totonicapán": [
    "Momostenango",
    "San Andrés Xecul",
    "San Bartolo",
    "San Cristóbal Totonicapán",
    "San Francisco el Alto",
    "Santa Lucía la Reforma",
    "Santa María Chiquimula",
    "Totonicapán"
  ],
  "Quetzaltenango": [
    "Almolonga",
    "Cabricán",
    "Cajolá",
    "Cantel",
    "Coatepeque",
    "Colomba",
    "Concepción Chiquirichapa",
    "El Palmar",
    "Flores Costa Cuca",
    "Génova",
    "Huitán",
    "La Esperanza",
    "Olintepeque",
    "Palestina de los Altos",
    "Quetzaltenango",
    "Salcajá",
    "San Carlos Sija",
    "San Francisco la Unión",
    "San Juan Ostuncalco",
    "San Martín Sacatepéquez",
    "San Mateo",
    "San Miguel Siguilá",
    "Sibilia",
    "Zunil"
  ],
  "Suchitepéquez": [
    "Chicacao",
    "Cuyotenango",
    "Mazatenango",
    "Patulul",
    "Pueblo Nuevo",
    "Río Bravo",
    "Samayac",
    "San Antonio Suchitepéquez",
    "San Bernardino",
    "San Francisco Zapotitlán",
    "San Gabriel",
    "San José el Idolo",
    "San José la Máquina",
    "San Juan Bautista",
    "San Lorenzo",
    "San Miguel Panán",
    "San Pablo Jocopilas",
    "Santa Bárbara",
    "Santo Domingo Suchitepéquez",
    "Santo Tomás la Unión",
    "Zunilito"
  ],
  "Retalhuleu": [
    "Champerico",
    "El Asintal",
    "Nuevo San Carlos",
    "Retalhuleu",
    "San Andrés Villa Seca",
    "San Felipe",
    "San Martín Zapotitlán",
    "San Sebastián",
    "Santa Cruz Muluá"
  ],
  "San Marcos": [
    "Ayutla",
    "Catarina",
    "Comitancillo",
    "Concepción Tutuapa",
    "El Quetzal",
    "El Tumbador",
    "Esquipulas Palo Gordo",
    "Ixchiguán",
    "La Blanca",
    "La Reforma",
    "Malacatán",
    "Nuevo Progreso",
    "Ocós",
    "Pajapita",
    "Río Blanco",
    "San Antonio Sacatepéquez",
    "San Cristóbal Cucho",
    "San José El Rodeo",
    "San José Ojetenam",
    "San Lorenzo",
    "San Marcos",
    "San Miguel Ixtahuacán",
    "San Pablo",
    "San Pedro Sacatepéquez",
    "San Rafael Pie de la Cuesta",
    "San Sibinal",
    "Sipacapa",
    "Tacaná",
    "Tajumulco",
    "Tejutla"
  ],
  "Huehuetenango": [
    "Aguacatán",
    "Chiantla",
    "Colotenango",
    "Concepción Huista",
    "Cuilco",
    "Huehuetenango",
    "Jacaltenango",
    "La Democracia",
    "La Libertad",
    "Malacatancito",
    "Nentón",
    "Petatán",
    "San Antonio Huista",
    "San Gaspar Ixchil",
    "San Ildefonso Ixtahuacán",
    "San Juan Atitán",
    "San Juan Ixcoy",
    "San Mateo Ixtatán",
    "San Miguel Acatán",
    "San Pedro Nécta",
    "San Pedro Soloma",
    "San Rafael la Independencia",
    "San Rafael Petzal",
    "San Sebastián Coatán",
    "San Sebastián Huehuetenango",
    "Santa Ana Huista",
    "Santa Bárbara",
    "Santa Cruz Barillas",
    "Santa Eulalia",
    "Santiago Chimaltenango",
    "Tectitán",
    "Todos Santos Cuchumatán",
    "Unión Cantinil"
  ],
  "Quiché": [
    "Canillá",
    "Chajul",
    "Chicamán",
    "Chiché",
    "Chichicastenango",
    "Chinique",
    "Cunén",
    "Ixcán",
    "Joyabaj",
    "Nebaj",
    "Pachalum",
    "Patzité",
    "Sacapulas",
    "San Andrés Sajcabajá",
    "San Antonio Ilotenango",
    "San Bartolomé Jocotenango",
    "San Juan Cotzal",
    "San Pedro Jocopilas",
    "Santa Cruz del Quiché",
    "Uspantán",
    "Zacualpa"
  ],
  "Baja Verapaz": [
    "Cubulco",
    "Granados",
    "Purulhá",
    "Rabinal",
    "Salamá",
    "San Jerónimo",
    "San Miguel Chicaj",
    "Santa Cruz El Chol"
  ],
  "Alta Verapaz": [
    "Cahabón",
    "Chahal",
    "Chisec",
    "Cobán",
    "Fray Bartolomé de las Casas",
    "Lanquín",
    "Panzós",
    "Raxruhá",
    "San Cristóbal Verapaz",
    "San Juan Chamelco",
    "San Pedro Carchá",
    "Santa Catalina la Tinta",
    "Santa Cruz Verapaz",
    "Senahú",
    "Tactic",
    "Tamahú",
    "Tucurú"
  ],
  "Petén": [
    "Dolores",
    "El Chal",
    "Flores",
    "La Libertad",
    "Las Cruces",
    "Melchor de Mencos",
    "Poptún",
    "San Andrés",
    "San Benito",
    "San Francisco",
    "San José",
    "San Luis",
    "Santa Ana",
    "Sayaxché"
  ],
  "Izabal": [
    "El Estor",
    "Livingston",
    "Los Amates",
    "Morales",
    "Puerto Barrios"
  ],
  "Zacapa": [
    "Cabañas",
    "Estanzuela",
    "Gualán",
    "Huité",
    "La Unión",
    "Río Hondo",
    "San Diego",
    "San Jorge",
    "Teculután",
    "Usumatlán",
    "Zacapa"
  ],
  "Chiquimula": [
    "Camotán",
    "Chiquimula",
    "Concepción las Minas",
    "Esquipulas",
    "Ipala",
    "Jocotán",
    "Olopa",
    "Quezaltepeque",
    "San Jacinto",
    "San José la Arada",
    "San Juan Ermita"
  ],
  "Jalapa": [
    "Jalapa",
    "Mataquescuintla",
    "Monjas",
    "San Carlos Alzatate",
    "San Luis Jilotepeque",
    "San Manuel Chaparrón",
    "San Pedro Pinula"
  ],
  "Jutiapa": [
    "Agua Blanca",
    "Asunción Mita",
    "Atescatempa",
    "Comapa",
    "Conguaco",
    "El Adelanto",
    "El Progreso",
    "Jalpatagua",
    "Jerez",
    "Jutiapa",
    "Moyuta",
    "Pasaco",
    "Quezada",
    "San José Acatempa",
    "Santa Catarina Mita",
    "Yupiltepeque",
    "Zapotitlán"
  ]
};

export function obtenerMunicipiosPorDepartamento(departamento: string): readonly string[] {
  return MUNICIPIOS_POR_DEPARTAMENTO[departamento] ?? [];
}

export function buscarDepartamentoPorMunicipio(municipio: string): string | null {
  const normalizado = normalizarTextoUbicacion(municipio);
  for (const departamento of DEPARTAMENTOS_GUATEMALA) {
    const municipios = MUNICIPIOS_POR_DEPARTAMENTO[departamento] ?? [];
    if (municipios.some((nombre) => normalizarTextoUbicacion(nombre) === normalizado)) {
      return departamento;
    }
  }
  return null;
}

export function normalizarTextoUbicacion(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function resolverDepartamentoGuardado(departamento: string, municipio: string): string {
  if (departamento && MUNICIPIOS_POR_DEPARTAMENTO[departamento]) {
    return departamento;
  }

  const porMunicipio = buscarDepartamentoPorMunicipio(municipio);
  if (porMunicipio) {
    return porMunicipio;
  }

  const deptoNormalizado = normalizarTextoUbicacion(departamento);
  return (
    DEPARTAMENTOS_GUATEMALA.find(
      (nombre) => normalizarTextoUbicacion(nombre) === deptoNormalizado,
    ) ?? ''
  );
}

export function resolverMunicipioGuardado(departamento: string, municipio: string): string {
  const municipios = obtenerMunicipiosPorDepartamento(departamento);
  if (!municipio) {
    return '';
  }

  const coincidenciaExacta = municipios.find((nombre) => nombre === municipio);
  if (coincidenciaExacta) {
    return coincidenciaExacta;
  }

  const normalizado = normalizarTextoUbicacion(municipio);
  return municipios.find((nombre) => normalizarTextoUbicacion(nombre) === normalizado) ?? municipio;
}
