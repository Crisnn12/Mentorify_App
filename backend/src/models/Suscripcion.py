from datetime import date

class Suscripcion:
    def __init__(self, id_suscripcion: int, costo: float, fecha_inicio: date, fecha_expiracion: date): #Complejidad de 1
        self.id_suscripcion = id_suscripcion
        self.costo = costo
        self.fecha_inicio = fecha_inicio
        self.fecha_expiracion = fecha_expiracion
        self.activa = False
        #+1 por base de la función

    def pagar(self) -> None: #Complejidad de 1
        print(f"Pago de suscripción de ${self.costo} procesado.")
        #+1 por base de la función

    def activar_suscripcion(self) -> None: #Complejidad de 2
        if self.fecha_expiracion >= date.today(): # +1
            self.activa = True
            print("Suscripción activada con éxito.")
        else: #+1
            print("Error: La fecha de expiración ya pasó.")
        #+1 por base de la función

    def __repr__(self) -> str: #Complejidad de 1
        return f"Suscripcion(ID='{self.id_suscripcion}', Activa='{self.activa}', Costo='${self.costo}')"
        #+1 por base de la función
