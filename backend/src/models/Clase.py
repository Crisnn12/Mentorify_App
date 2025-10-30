import uuid
from datetime import datetime
from typing import List, Dict, Optional

_CLASES_DB = [
    {
        'id_clase': 'clase-a1',
        'id_tutor': 'user-202',
        'id_materia': 'mat-2',
        'titulo': 'Introducción al Cálculo Diferencial',
        'descripcion': 'Conceptos fundamentales de límites y derivadas.',
        'url_video': 'https://storage.platform.com/videos/clase-a1.mp4',
        'url_portada': 'https://placehold.co/600x400/3B5998/ffffff?text=Cálculo',
        'duracion_segundos': 3600,
        'vistas': 5500,
        'fecha_hora': datetime(2025, 10, 25, 15, 0, 0).isoformat(),
        'es_vivo': False 
    },
    {
        'id_clase': 'clase-b2',
        'id_tutor': 'user-303', 
        'id_materia': 'prog-1',
        'titulo': 'Programación Orientada a Objetos: Polimorfismo',
        'descripcion': 'Sesión en vivo sobre herencia y polimorfismo en Python.',
        'url_video': 'https://storage.platform.com/live/clase-b2-stream.m3u8',
        'url_portada': 'https://placehold.co/600x400/6A5ACD/ffffff?text=POO',
        'duracion_segundos': 0,
        'vistas': 150,
        'fecha_hora': datetime.now().isoformat(),
        'es_vivo': True 
    },
]

class Clase:
    def __init__(self, id_tutor: str, id_materia: str, titulo: str, descripcion: str, url_video: str, url_portada: str,
                 duracion_segundos: int, vistas: int, fecha_hora: str, es_vivo: bool, id_clase: Optional[str] = None):

        self.id_clase = id_clase if id_clase else str(uuid.uuid4())
        self.id_tutor = id_tutor
        self.id_materia = id_materia
        self.titulo = titulo
        self.descripcion = descripcion
        self.url_video = url_video
        self.url_portada = url_portada
        self.duracion_segundos = duracion_segundos
        self.vistas = vistas
        self.fecha_hora = fecha_hora
        self.es_vivo = es_vivo

    def __repr__(self):
        tipo = "EN VIVO" if self.es_vivo else "GRABADA"
        return (f"Clase(ID='{self.id_clase}', Tipo='{tipo}', Título='{self.titulo[:30]}...', "
                f"Tutor='{self.id_tutor}', Vistas={self.vistas})")

    @staticmethod
    def crear_clase(id_tutor: str, id_materia: str, datos: Dict) -> 'Clase':
        nueva_clase = Clase(
            id_tutor=id_tutor,
            id_materia=id_materia,
            titulo=datos['titulo'],
            descripcion=datos.get('descripcion', ''),
            url_video=datos['url_video'],
            url_portada=datos.get('url_portada', 'placeholder_url'),
            duracion_segundos=datos.get('duracion_segundos', 0),
            vistas=0,
            fecha_hora=datetime.now().isoformat(),
            es_vivo=datos.get('es_vivo', False)
        )
        
        _CLASES_DB.append(vars(nueva_clase))
        
        print(f"Servicio: Clase '{nueva_clase.titulo}' creada con éxito.")
        return nueva_clase

    @staticmethod
    def actualizar_clase(id_clase: str, datos: Dict) -> Optional['Clase']:

        for i, c in enumerate(_CLASES_DB):
            if c['id_clase'] == id_clase:
                for key, value in datos.items():
                    if key in c:
                        _CLASES_DB[i][key] = value
                
                print(f"Servicio: Clase '{id_clase}' actualizada.")
                return Clase(**_CLASES_DB[i])
        
        print(f"Error: Clase con ID {id_clase} no encontrada para actualización.")
        return None

    @staticmethod
    def eliminar_clase(id_clase: str) -> bool:
        global _CLASES_DB
        initial_len = len(_CLASES_DB)
        _CLASES_DB = [c for c in _CLASES_DB if c['id_clase'] != id_clase]
        
        if len(_CLASES_DB) < initial_len:
            print(f"Servicio: Clase '{id_clase}' eliminada con éxito.")
            return True
        else:
            print(f"Error: Clase con ID {id_clase} no encontrada para eliminación.")
            return False

    @staticmethod
    def obtener_portada(id_clase: str) -> Optional[str]:
        for c in _CLASES_DB:
            if c['id_clase'] == id_clase:
                return c['url_portada']
        return None
    
    @staticmethod
    def incrementar_vistas(id_clase: str) -> None:
        for c in _CLASES_DB:
            if c['id_clase'] == id_clase:
                c['vistas'] = c['vistas'] + 1
                print(f"Servicio: Vistas de clase {id_clase} incrementadas a {c['vistas']}")
                return
            
if __name__ == "__main__":
    TUTOR_A_ID = 'user-202'
    MATERIA_PROG_ID = 'prog-1'
    
    print("--- PRUEBA DE CLASE CLASE ---")

    nueva_clase_datos = {
        'titulo': 'Introducción a Machine Learning',
        'descripcion': 'Primeros pasos con librerías de ML en Python.',
        'url_video': 'https://storage.platform.com/videos/ml-intro.mp4',
        'url_portada': 'https://placehold.co/600x400/9400D3/ffffff?text=ML',
        'duracion_segundos': 4500,
        'es_vivo': False
    }

    nueva_clase = Clase.crear_clase(TUTOR_A_ID, MATERIA_PROG_ID, nueva_clase_datos)
    print(f"\nClase recién creada: {nueva_clase}")

    Clase.incrementar_vistas(nueva_clase.id_clase)
    Clase.incrementar_vistas(nueva_clase.id_clase)
    
    datos_actualizacion = {
        'titulo': 'Introducción a Machine Learning (Edición 2025)',
        'duracion_segundos': 4560
    }
    clase_actualizada = Clase.actualizar_clase(nueva_clase.id_clase, datos_actualizacion)
    print(f"\nClase actualizada: {clase_actualizada.titulo}, Duración: {clase_actualizada.duracion_segundos}s")

    clase_a_eliminar_id = 'clase-a1'
    eliminado = Clase.eliminar_clase(clase_a_eliminar_id)
    print(f"\nClase '{clase_a_eliminar_id}' eliminada: {eliminado}")
    
    print(f"\nTotal de clases restantes: {len(_CLASES_DB)}")
    for clase in _CLASES_DB:
        print(f"- {clase['titulo']} (Tutor: {clase['id_tutor']})")

