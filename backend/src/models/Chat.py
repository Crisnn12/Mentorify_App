import uuid
from datetime import datetime
from typing import List, Dict, Optional

_MENSAJES_DB = [
    {
        'id_chat': str(uuid.uuid4()),
        'id_remitente': 'user-101',  
        'id_destinatario': 'user-202', 
        'contenido_mensaje': 'Profesor, ¿podría explicarme la recursividad simple?',
        'timestamp': datetime(2025, 10, 28, 10, 30, 0).isoformat(),
        'leido': True
    },
    {
        'id_chat': str(uuid.uuid4()),
        'id_remitente': 'user-202', 
        'id_destinatario': 'user-101', 
        'contenido_mensaje': '¡Hola! Sí, claro. ¿Qué día te vendría bien para una sesión en vivo?',
        'timestamp': datetime(2025, 10, 28, 10, 31, 30).isoformat(),
        'leido': False 
    },
]

class Mensaje:
    def __init__(self, id_remitente: str, id_destinatario: str, contenido_mensaje: str,
                 id_chat: Optional[str] = None, timestamp: Optional[str] = None, leido: bool = False):

     
        self.id_chat = id_chat if id_chat else str(uuid.uuid4())
        self.id_remitente = id_remitente
        self.id_destinatario = id_destinatario
        self.contenido_mensaje = contenido_mensaje
        self.timestamp = timestamp if timestamp else datetime.now().isoformat()
        self.leido = leido

    def __repr__(self):
        return (f"Mensaje(ID='{self.id_chat}', De='{self.id_remitente}', "
                f"A='{self.id_destinatario}', Contenido='{self.contenido_mensaje[:20]}...', "
                f"Leido={self.leido})")

    @staticmethod
    def enviar_mensaje(id_remitente: str, id_destinatario: str, contenido: str) -> 'Mensaje':
        nuevo_mensaje = Mensaje(
            id_remitente=id_remitente,
            id_destinatario=id_destinatario,
            contenido_mensaje=contenido,
            leido=False 
        )

        _MENSAJES_DB.append({
            'id_chat': nuevo_mensaje.id_chat,
            'id_remitente': nuevo_mensaje.id_remitente,
            'id_destinatario': nuevo_mensaje.id_destinatario,
            'contenido_mensaje': nuevo_mensaje.contenido_mensaje,
            'timestamp': nuevo_mensaje.timestamp,
            'leido': nuevo_mensaje.leido
        })
        
        print(f"Servicio: Mensaje enviado de {id_remitente} a {id_destinatario}.")
        return nuevo_mensaje

    @staticmethod
    def obtener_conversacion(usuario1: str, usuario2: str) -> List['Mensaje']:
        print(f"Servicio: Obteniendo conversación entre {usuario1} y {usuario2}...")
        
        conversacion_data = [
            m for m in _MENSAJES_DB 
            if (m['id_remitente'] == usuario1 and m['id_destinatario'] == usuario2) or 
               (m['id_remitente'] == usuario2 and m['id_destinatario'] == usuario1)
        ]
        
        conversacion_data.sort(key=lambda x: x['timestamp'])

        return [
            Mensaje(
                m['id_remitente'],
                m['id_destinatario'],
                m['contenido_mensaje'],
                m['id_chat'],
                m['timestamp'],
                m['leido']
            )
            for m in conversacion_data
        ]

    @staticmethod
    def marcar_leido(id_mensaje: str) -> bool:
        for m in _MENSAJES_DB:
            if m['id_chat'] == id_mensaje:
                m['leido'] = True
                print(f"Servicio: Mensaje {id_mensaje} marcado como leído.")
                return True
        return False

if __name__ == "__main__":
    print("--- PRUEBA DE CLASE CHAT ---")

    ESTUDIANTE_ID = 'user-101'
    TUTOR_ID = 'user-202'
    
    conversacion = Mensaje.obtener_conversacion(ESTUDIANTE_ID, TUTOR_ID)
    print(f"\nConversación inicial ({len(conversacion)} mensajes):")
    for msg in conversacion:
        print(f"- [{msg.timestamp[:19]}] De: {msg.id_remitente} | Leído: {msg.leido} | '{msg.contenido_mensaje[:30]}...'")

    Mensaje.enviar_mensaje(
        id_remitente=ESTUDIANTE_ID,
        id_destinatario=TUTOR_ID,
        contenido="Perfecto, ¿la próxima semana el martes a las 15:00 horas?"
    )

    mensaje_no_leido_id = _MENSAJES_DB[1]['id_chat']
    Mensaje.marcar_leido(mensaje_no_leido_id)

    conversacion_final = Mensaje.obtener_conversacion(ESTUDIANTE_ID, TUTOR_ID)
    print(f"\nConversación final ({len(conversacion_final)} mensajes):")
    for msg in conversacion_final:
        print(f"- [{msg.timestamp[:19]}] De: {msg.id_remitente} | Leído: {msg.leido} | '{msg.contenido_mensaje[:30]}...'")
    

