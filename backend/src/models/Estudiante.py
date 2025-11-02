from typing import List, Optional
from usuario import Usuario
from suscripcion import Suscripcion
from tutor import Tutor
from tutor import Clase 

class Estudiante(Usuario):
    def __init__(self, nombre: str, correo: str, contrasena: str, fecha_registro: str, carrera: str, id_usuario: Optional[str] = None):
        super().__init__(nombre, correo, contrasena, Usuario.ROL_ESTUDIANTE, fecha_registro, id_usuario)
        self.carrera = carrera
        self.suscripcion: Optional[Suscripcion] = None
        self.clases_vistas: List[Clase] = []

    def buscar_tutor(self, tema: str, lista_tutores: List[Tutor]) -> List[Tutor]: 
        print(f"Estudiante {self.nombre} buscando tutores con experiencia en '{tema}'.")
        return [t for t in lista_tutores if tema in t.especialidad] 

    def ver_clase(self, clase: Clase) -> None: 
        if not self.suscripcion or not self.suscripcion.activa: 
            print(f"ADVERTENCIA: {self.nombre} no puede ver '{clase.titulo}'. Suscripción inactiva.")
            return 

        if clase not in self.clases_vistas: 
            self.clases_vistas.append(clase)
        print(f"Estudiante {self.nombre} está viendo la clase: '{clase.titulo}'.")

    def suscribirse(self, suscripcion: Suscripcion) -> None:
        suscripcion.pagar()
        suscripcion.activar_suscripcion()
        self.suscripcion = suscripcion
        print(f"Estudiante {self.nombre} se ha suscrito con éxito.")

