from typing import List, Optional
from usuario import Usuario

class Clase:
    def __init__(self, titulo: str):
        self.titulo = titulo
    def iniciar_transmision(self):
        print(f"Clase '{self.titulo}' iniciando transmisión...")
        
class Tutor(Usuario):
    def __init__(self, nombre: str, correo: str, contrasena: str, fecha_registro: str,
                 especialidad: str, descripcion: str, calificacion_promedio: float, id_usuario: Optional[str] = None): 
        super().__init__(nombre, correo, contrasena, Usuario.ROL_TUTOR, fecha_registro, id_usuario)
        self.especialidad = especialidad
        self.descripcion = descripcion
        self.calificacion_promedio = calificacion_promedio
        self.clases_impartidas: List[Clase] = []

    def transmitir_clase(self, clase: Clase) -> None: 
        if clase not in self.clases_impartidas:
            self.clases_impartidas.append(clase)
            print(f"Tutor {self.nombre} ha asociado la clase '{clase.titulo}'.")
        clase.iniciar_transmision()
