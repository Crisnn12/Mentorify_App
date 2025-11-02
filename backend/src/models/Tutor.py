# Simulación de importación de clases necesarias
from typing import List, Optional
from usuario import Usuario
# Asumimos que la clase Clase existe en otro archivo o se define arriba

# Definición mínima de Clase solo para que Tutor compile
class Clase:
    def __init__(self, titulo: str):
        self.titulo = titulo
    def iniciar_transmision(self):
        print(f"Clase '{self.titulo}' iniciando transmisión...")
        
class Tutor(Usuario):
    def __init__(self, nombre: str, correo: str, contrasena: str, fecha_registro: str,
                 especialidad: str, descripcion: str, calificacion_promedio: float, id_usuario: Optional[str] = None): # CC: 1
        super().__init__(nombre, correo, contrasena, Usuario.ROL_TUTOR, fecha_registro, id_usuario)
        self.especialidad = especialidad
        self.descripcion = descripcion
        self.calificacion_promedio = calificacion_promedio
        self.clases_impartidas: List[Clase] = []
        # Base de la función: +1

    def transmitir_clase(self, clase: Clase) -> None: # CC: 3
        if clase not in self.clases_impartidas: # +1 (if 1)
            self.clases_impartidas.append(clase)
            print(f"Tutor {self.nombre} ha asociado la clase '{clase.titulo}'.")
        clase.iniciar_transmision()
        # Base de la función: +1
