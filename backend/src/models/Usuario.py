import uuid
from datetime import date
from typing import Optional, Dict, List
from werkzeug.security import generate_password_hash, check_password_hash

_USUARIOS_DB: List[Dict] = []

class Usuario:

    ROL_ESTUDIANTE = 'estudiante'
    ROL_TUTOR = 'tutor'

    def __init__(self, nombre: str, correo: str, contrasena: str, rol: str, fecha_registro: date, id_usuario: Optional[str] = None):
        self.id_usuario = id_usuario if id_usuario else str(uuid.uuid4())
        self.nombre = nombre
        self.correo = correo
        self.contrasena = contrasena
        self.rol = rol
        self.fecha_registro = fecha_registro

    @classmethod
    def register(cls, nombre: str, correo: str, contrasena: str, rol: str) -> Optional[Dict]:
        if any(u.get("correo") == correo for u in _USUARIOS_DB): 
            print(f"ERROR: Ya existe un usuario registrado con el correo {correo}.")
            return None 
            
        hashed_password = generate_password_hash(contrasena, method='pbkdf2:sha256')

        nuevo_documento = {
            "id_usuario": str(uuid.uuid4()),
            "nombre": nombre,
            "correo": correo,
            "contrasena": hashed_password,
            "rol": rol,
            "fecha_registro": date.today().isoformat()
        }
        
        _USUARIOS_DB.append(nuevo_documento)
        
        print(f"[REGISTER] Usuario '{nombre}' ({rol}) registrado con exito. ID: {nuevo_documento['id_usuario']}")
        return nuevo_documento

    @classmethod
    def login(cls, correo: str, contrasena: str) -> Optional[Dict]:
        usuario_documento = next((u for u in _USUARIOS_DB if u.get("correo") == correo), None) 

        if usuario_documento is None: 
            print(f"[LOGIN] ERROR: Usuario no encontrado para el correo {correo}.")
            return None

        if check_password_hash(usuario_documento['contrasena'], contrasena): 
            print(f"[LOGIN] EXITO: {usuario_documento['nombre']} ha iniciado sesion.")
            return usuario_documento
        else: 
            print("[LOGIN] ERROR: Contraseña incorrecta.")
            return None

    def logout(self) -> None: 
        print(f"[{self.rol}] {self.nombre} ha cerrado sesión.")

    def editar_perfil(self, nuevo_nombre: str = None, nuevo_correo: str = None) -> None: 
        if nuevo_nombre: 
            self.nombre = nuevo_nombre
        if nuevo_correo: 
            self.correo = nuevo_correo
        print(f"Perfil de {self.nombre} actualizado (NOTA: Se requiere guardar en DB).")

    def __repr__(self) -> str: 
        return f"Usuario(Nombre='{self.nombre}', Rol='{self.rol}', Correo='{self.correo}')"
