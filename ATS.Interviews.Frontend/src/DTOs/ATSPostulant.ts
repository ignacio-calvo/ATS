export interface ATSPostulant {
  id: string;
  email: string;
  conocimientos: {
    tipo: string;
    nombre: string;
    nivel: string;
    calificacion: string;
    descripcion: string;
  }[];
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // Format: DD-MM-YYYY
  telefonoFijo: string;
  telefonoCelular: string;
  cuil: string;
  genero: string;
  fotoPerfil: string;
  presentacionPostulante: string;
  redesSociales: {
    linkedin: string;
    facebook: string;
    twitter: string;
    googlePlus: string;
    skype: string;
    website: string;
  }[];
  direccion: {
    pais: string;
    provincia: string;
    ciudad: string;
    direccion: string;
    paisId: number;
    provinciaId: number;
    ciudadId: number;
  }[];
  nacionalidad: string;
  etapa: string;
  experienciasLaborales: {
    empresa: string;
    puesto: string;
    mesDesde: number;
    añoDesde: number;
    mesHasta: number;
    añoHasta: number;
    trabajoActual: boolean;
    pais: number;
    area: number;
    subArea: number;
    industria: number;
    seniority: number;
    descripcion: string;
  }[];
  estudios: {
    institucion: number;
    titulo: string;
    mesDesde: number;
    añoDesde: number;
    mesHasta: number;
    añoHasta: number;
    estudioActual: boolean;
    pais: number;
    area: number;
    nivel: number;
    estado: number;
    descripcion: string;
  }[];
  referencias: {
    apellido: string;
    nombre: string;
    relacion: string;
    telefono: string;
    email: string;
    descripcion: string;
  }[];
  fechaPostulacion: string; // Format: DD-MM-YYYY
  fechaAplicacion: string; // Format: DD-MM-YYYY
  fuente: string;
  legajo: string;
  salarioPretendido: string;
  vacanteId: string;
  vacanteNombre: string;
  calificacion: number;
  comentarios: {
    vacante: string;
    usuario: string;
    comentario: string;
    fecha: string; // Format: DD-MM-YYYY
  }[];
  disponibilidadHoraria: string;
  disponibilidadRelocacion: string;
  rechazado: string;
  tags: {
    nombre: string;
    creadoPor: string;
    fechaCreacion: string;
  }[];
  reportes: {
    vacante: string;
    fechaCreacion: string; // Format: DD-MM-YYYY
    descripcion: string;
    ultimaModificacionPor: string;
    creadoPor: string;
    fechaUltimaModificacion: string; // Format: DD-MM-YYYY
  }[];
  adjuntos: {
    nombreArchivo: string;
  };
}