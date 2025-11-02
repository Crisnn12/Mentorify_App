from typing import List, Optional
from usuario import Usuario
from suscripcion import Suscripcion
# Simulación de importación de clases necesarias
from tutor import Tutor
from tutor import Clase # Clase dummy para tipado

class Estudiante(Usuario):
    def __init__(self, nombre: str, correo: str, contrasena: str, fecha_registro: str, carrera: str, id_usuario: Optional[str] = None): # CC: 1
        # Usamos la constante del padre para el rol
        super().__init__(nombre, correo, contrasena, Usuario.ROL_ESTUDIANTE, fecha_registro, id_usuario)
        self.carrera = carrera
        self.suscripcion: Optional[Suscripcion] = None
        self.clases_vistas: List[Clase] = []
        # Base de la función: +1

    def buscar_tutor(self, tema: str, lista_tutores: List[Tutor]) -> List[Tutor]: # CC: 2
        print(f"Estudiante {self.nombre} buscando tutores con experiencia en '{tema}'.")
        return [t for t in lista_tutores if tema in t.especialidad] # +1 (list comp. / if)
        # Base de la función: +1

    def ver_clase(self, clase: Clase) -> None: # CC: 4
        if not self.suscripcion or not self.suscripcion.activa: # +1 (if 1 - or lógico)
            print(f"ADVERTENCIA: {self.nombre} no puede ver '{clase.titulo}'. Suscripción inactiva.")
            return # +1 (retorno temprano)

        if clase not in self.clases_vistas: # +1 (if 2)
            self.clases_vistas.append(clase)
        print(f"Estudiante {self.nombre} está viendo la clase: '{clase.titulo}'.")
        # Base de la función: +1

    def suscribirse(self, suscripcion: Suscripcion) -> None: # CC: 1
        suscripcion.pagar()
        suscripcion.activar_suscripcion()
        self.suscripcion = suscripcion
        print(f"Estudiante {self.nombre} se ha suscrito con éxito.")
        # Base de la función: +1
