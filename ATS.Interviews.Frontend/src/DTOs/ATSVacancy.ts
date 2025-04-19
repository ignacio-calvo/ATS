export interface ATSVacancy {
  deadline: string; // Format: DD-MM-YYYY
  gestion: string;
  tags: string;
  nombre: string;
  area: {
    nombre: string;
    responsable: string;
    emailResponsable: string;
    telefonoResponsable: string;
    fechaCreacion: string; // Format: DD-MM-YYYY
    id: string;
  };
  subArea: {
    nombre: string;
    responsable: string;
    emailResponsable: string;
    telefonoResponsable: string;
    fechaCreacion: string; // Format: DD-MM-YYYY
    id: string;
  };
  cliente: {
    compañia: string;
    responsable: string;
    emailResponsable: string;
    telefonoResponsable: string;
    direccion: string;
    fechaCreacion: string; // Format: DD-MM-YYYY
    id: string;
    descripcion: string;
  };
  subCliente: {
    id: string;
    nombre: string;
    responsable: string;
    emailResponsable: string;
    telefonoResponsable: string;
    fechaCreacion: string; // Format: DD-MM-YYYY
    descripcion: string;
  };
  fechaCreacion: string; // Format: DD-MM-YYYY
  fechaCierre: string; // Format: DD-MM-YYYY
  estadoActual: string;
  ubicacion: {
    id: string;
    fechaCreacion: string; // Format: DD-MM-YYYY
    pais: string;
    provincia: string;
    ciudad: string;
  };
  refId: string;
  creadaPor: {
    total: number;
    totalPaginas: number;
    usuarios: {
      id: string;
      username: string;
      email: string;
      rol: string;
      apellido: string;
      nombre: string;
    }[];
  };
  salarioOfrecido: string;
  razonBusqueda: string;
  descripcionEmpresa: string;
  beneficios: string;
  requisitos: string;
  areaTrabajo: string;
  subareaTrabajo: string;
  tipoTrabajo: string;
  modalidadTrabajo: string;
  estadoNivelEducacion: string;
  genero: string;
  jerarquia: string;
  nivelMinimoEducacion: string;
  youTubeId: string;
  vimeoId: string;
  descripcionTrabajo: string;
  prioridad: string;
  tipoDeContratacion: string;
  modalidadDeContratacion: string;
  posicionesACubrir: number;
  remuneracion: number;
  tipoSalario: string;
  requisitoIdioma: string;
  idioma: string;
  requisitoReubicacionLaboral: string;
  requisitoDisponibilidadHoraria: string;
  requisitoRemuneracion: string;
  requisitoGenero: string;
  requisitoSecundarioCompleto: string;
  requisitoDni: string;
  requisitoDireccion: string;
  requisitoTelefonoAdicional: string;
  requisitoTrabajo: string;
  requisitoEducacion: string;
  requisitoConocidos: string;
  aptoDiscapacitados: string;
  publicadaMicrosite: string;
  razonFinalizacion: string;
  publicada: string;
  despublicacionAutomatica: string; // Format: DD-MM-YYYY
  id: string;
  historial: string[];
  pipelineId: string;
  logoUrl: string;
  usuarios: {
    id: string;
    username: string;
    email: string;
    rol: string;
    apellido: string;
    nombre: string;
  }[];
}