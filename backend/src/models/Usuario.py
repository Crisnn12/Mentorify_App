import uuid
from datetime import date
from typing import Optional, Dict, List
from werkzeug.security import generate_password_hash, check_password_hash

# Base de datos simulada para la arquitectura del proyecto (coherente con _MATERIAS_DB)
_USUARIOS_DB: List[Dict] = []


class Usuario:

    ROL_ESTUDIANTE = 'estudiante'
    ROL_TUTOR = 'tutor'

    def __init__(self, nombre: str, correo: str, contrasena: str, rol: str, fecha_registro: date, id_usuario: Optional[str] = None): # CC: 2
        # El ID ahora se genera automáticamente si no se proporciona
        self.id_usuario = id_usuario if id_usuario else str(uuid.uuid4()) # +1 (if/else)
        self.nombre = nombre
        self.correo = correo
        self.contrasena = contrasena # Contraseña hasheada (aunque el campo se llama igual)
        self.rol = rol
        self.fecha_registro = fecha_registro
        # Base de la función: +1

    @classmethod
    def register(cls, nombre: str, correo: str, contrasena: str, rol: str) -> Optional[Dict]: # CC: 4
        # 1. Verificar si el correo ya existe
        if any(u.get("correo") == correo for u in _USUARIOS_DB): # +1 (if 1 + list comp.)
            print(f"ERROR: Ya existe un usuario registrado con el correo {correo}.")
            return None # +1 (retorno temprano)

        # 2. Hashear la contraseña
        hashed_password = generate_password_hash(contrasena, method='pbkdf2:sha256')

        # 3. Crear el nuevo documento y guardarlo en la DB simulada
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
        # Base de la función: +1

    @classmethod
    def login(cls, correo: str, contrasena: str) -> Optional[Dict]: # CC: 5
        # 1. Buscar usuario por correo en la DB simulada
        usuario_documento = next((u for u in _USUARIOS_DB if u.get("correo") == correo), None) # +1 (list comp.)

        if usuario_documento is None: # +1 (if 1 - usuario no encontrado)
            print(f"[LOGIN] ERROR: Usuario no encontrado para el correo {correo}.")
            return None # +1 (retorno temprano)

        # 2. Verificar contraseña
        if check_password_hash(usuario_documento['contrasena'], contrasena): # +1 (if 2 - contraseña correcta)
            print(f"[LOGIN] EXITO: {usuario_documento['nombre']} ha iniciado sesion.")
            return usuario_documento
        else: # +1 (else - contraseña incorrecta)
            print("[LOGIN] ERROR: Contraseña incorrecta.")
            return None
        # Base de la función: +1

    def logout(self) -> None: # CC: 1
        print(f"[{self.rol}] {self.nombre} ha cerrado sesión.")
        # Base de la función: +1

    def editar_perfil(self, nuevo_nombre: str = None, nuevo_correo: str = None) -> None: # CC: 3
        if nuevo_nombre: # +1 (if 1)
            self.nombre = nuevo_nombre
        if nuevo_correo: # +1 (if 2)
            self.correo = nuevo_correo
        print(f"Perfil de {self.nombre} actualizado (NOTA: Se requiere guardar en DB).")
        # Base de la función: +1

    def __repr__(self) -> str: # CC: 1
        return f"Usuario(Nombre='{self.nombre}', Rol='{self.rol}', Correo='{self.correo}')"
        # Base de la función: +1
