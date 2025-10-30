import uuid
from typing import List, Dict, Optional

_MATERIAS_DB = [
    {
        'id_materia': 'prog-1',
        'nombre': 'Programación',
        'color_hex': '#3B5998',
        'icono': 'code-tags'
    },
    {
        'id_materia': 'mat-2',
        'nombre': 'Matemáticas',
        'color_hex': '#6A5ACD',
        'icono': 'sigma'
    },
    {
        'id_materia': 'hist-3',
        'nombre': 'Historia',
        'color_hex': '#B22222',
        'icono': 'hourglass-empty'
    },
    {
        'id_materia': 'econ-4',
        'nombre': 'Economía',
        'color_hex': '#FFD700',
        'icono': 'finance'
    },
]

class Materia:
    def __init__(self, nombre: str, color_hex: str, icono: str, id_materia: Optional[str] = None):

        # Atributos
        self.id_materia = id_materia if id_materia else str(uuid.uuid4())
        self.nombre = nombre
        self.color_hex = color_hex
        self.icono = icono

    def __repr__(self):
        return f"Materia(ID='{self.id_materia}', Nombre='{self.nombre}', Color='{self.color_hex}')"
    
    @staticmethod
    def obtener_todas() -> List['Materia']:
        print("Servicio: Obteniendo todas las materias...")
        return [
            Materia(
                m['nombre'], 
                m['color_hex'], 
                m['icono'], 
                m['id_materia']
            ) 
            for m in _MATERIAS_DB
        ]

    @staticmethod
    def crear_materia(nombre: str, color_hex: str, icono: str) -> 'Materia':
        nueva_materia = Materia(nombre=nombre, color_hex=color_hex, icono=icono)
        
        _MATERIAS_DB.append({
            'id_materia': nueva_materia.id_materia,
            'nombre': nueva_materia.nombre,
            'color_hex': nueva_materia.color_hex,
            'icono': nueva_materia.icono
        })
        print(f"Servicio: Materia '{nombre}' creada con éxito.")
        return nueva_materia


if __name__ == "__main__":
    materias_existentes = Materia.obtener_todas()
    print(f"\nTotal de materias encontradas: {len(materias_existentes)}")
    for materia in materias_existentes:
        print(materia)
    nueva_materia = Materia.crear_materia(
        nombre="Arte Digital",
        color_hex="#9400D3",
        icono="palette"
    )

    print(f"\nNueva materia creada: {nueva_materia}")
    
    materias_actualizadas = Materia.obtener_todas()
    print(f"\nTotal de materias después de la creación: {len(materias_actualizadas)}")
    
