from datetime import date

class Suscripcion:
    def __init__(self, id_suscripcion: int, costo: float, fecha_inicio: date, fecha_expiracion: date):
        self.id_suscripcion = id_suscripcion
        self.costo = costo
        self.fecha_inicio = fecha_inicio
        self.fecha_expiracion = fecha_expiracion
        self.activa = False

    def pagar(self) -> None:
        print(f"Pago de suscripción de ${self.costo} procesado.")

    def activar_suscripcion(self) -> None: 
        if self.fecha_expiracion >= date.today(): 
            self.activa = True
            print("Suscripción activada con éxito.")
        else:
            print("Error: La fecha de expiración ya pasó.")

    def __repr__(self) -> str: 
        return f"Suscripcion(ID='{self.id_suscripcion}', Activa='{self.activa}', Costo='${self.costo}')"
