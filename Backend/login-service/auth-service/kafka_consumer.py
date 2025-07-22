import os 
import time
import json
import traceback
from confluent_kafka import Consumer
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from passlib.hash import bcrypt

def conectar_kafka(group_id):
    for i in range(10):
        try:
            consumer = Consumer({
                'bootstrap.servers': os.getenv("KAFKA_BROKER", "kafka:9092"),
                'group.id': group_id,
                'auto.offset.reset': 'earliest'
            })
            print("✅ Conectado a Kafka")
            return consumer
        except Exception as e:
            print(f"❌ Intento {i+1}/10: Kafka no disponible - {e}")
            time.sleep(5)
    return None


# ✅ CONSUMIDOR: Crear Usuario
def consume_user_created():
    print("📥 Iniciando consumidor Kafka para customer_created")

    consumer = conectar_kafka("auth-created-group")  # ✅ Group ID único
    if not consumer:
        print("❌ No se pudo conectar a Kafka para creación de usuarios")
        return

    topic = os.getenv("KAFKA_TOPIC_CREATE", "customer_created")
    print(f"📡 Suscribiéndose al tópico: {topic}")
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Kafka error: {msg.error()}")
            continue

        try:
            data = json.loads(msg.value().decode('utf-8'))
            db: Session = next(get_db())

            if not db.query(User).filter_by(email=data['email']).first():
                new_user = User(
                    username=data.get('username', data['email']),
                    email=data['email'],
                    password=bcrypt.hash(data['password']),
                    role=data.get('role', 'cliente')
                )
                db.add(new_user)
                db.commit()
                print(f"✅ Usuario creado: {new_user.email}")
            else:
                print(f"ℹ️ Usuario ya existe: {data['email']}")

        except Exception as e:
            print(f"❌ Error al procesar evento Kafka: {e}")
            traceback.print_exc()  # ✅ Mostrar traceback

# ✅ CONSUMIDOR: Actualizar Usuario
def consume_user_updated():
    print("📥 Iniciando consumidor Kafka para user_updated")

    consumer = conectar_kafka("auth-update-group")
    if not consumer:
        print("❌ No se pudo conectar a Kafka para actualización de usuarios")
        return

    topic = os.getenv("KAFKA_TOPIC_UPDATE", "user_updated")
    print(f"📡 Suscribiéndose a tópico: {topic}")
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Kafka error: {msg.error()}")
            continue

        try:
            data = json.loads(msg.value().decode('utf-8'))
            print("🔔 Mensaje recibido:", data)

            email_anterior = data.get("email_anterior")
            update = data.get("update", {})

            # Intentar obtener la sesión DB con reintento en caso de error
            for intento in range(3):
                try:
                    db: Session = next(get_db())
                    user = db.query(User).filter(User.email == email_anterior).first()
                    break
                except Exception as db_error:
                    print(f"⚠️ Error DB en intento {intento+1}: {db_error}")
                    time.sleep(2)
            else:
                print("❌ No se pudo conectar a la base después de varios intentos.")
                continue
            
            if not user:
                print(f"⚠️ Usuario no encontrado: {email_anterior}")
                continue
                
            # Actualización segura con verificación de unicidad
            if 'email' in update:
                if update['email'] != email_anterior:
                    if db.query(User).filter(User.email == update['email']).first():
                        print(f"⚠️ Email ya existe: {update['email']}")
                        continue
                    user.email = update['email']
           
                
            if 'username' in update:
                user.username = update['username']
                
            db.commit()
            print(f"✅ Usuario actualizado: {user.email}")

        except Exception as e:
            print(f"❌ Error al procesar evento Kafka: {e}")
            traceback.print_exc()

            
def consume_user_deleted():
    consumer = conectar_kafka("auth-delete-group")
    if not consumer:
        print("❌ No se pudo conectar a Kafka para eliminación de usuarios")
        return

    topic = os.getenv("KAFKA_TOPIC_DELETE", "customer_deleted")
    print(f"📡 Suscribiéndose a tópico: {topic}")
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(1.0)
        if msg is None: continue
        if msg.error():
            print(f"Kafka error: {msg.error()}")
            continue

        try:
            data = json.loads(msg.value().decode('utf-8'))
            email = data.get("email")
            db: Session = next(get_db())

            user = db.query(User).filter_by(email=email).first()
            if user:
                db.delete(user)
                db.commit()
                print(f"🗑️ Usuario eliminado: {email}")
            else:
                print(f"ℹ️ Usuario no encontrado: {email}")
        except Exception as e:
            print(f"❌ Error al procesar evento de eliminación: {e}")
            
            
def consume_delivery_created():
    consumer = conectar_kafka("auth-delivery-group")
    if not consumer: return
    consumer.subscribe([os.getenv("KAFKA_TOPIC_DELIVERY_CREATE")])
    while True:
        msg = consumer.poll(1.0)
        if msg and not msg.error():
            try:
                data = json.loads(msg.value().decode())
                db: Session = next(get_db())
                if not db.query(User).filter_by(email=data['email']).first():
                    new = User(
                        username=data['username'],
                        email=data['email'],
                        password=bcrypt.hash(data['password']),
                        role=data.get('role', 'repartidor')
                    )
                    db.add(new); db.commit()
                    print(f"✅ Repartidor creado en auth: {new.email}")
            except Exception as e:
                traceback.print_exc()
            
def consume_delivery_updated():
    print("📥 Iniciando consumidor Kafka para delivery_updated")

    consumer = conectar_kafka("auth-delivery-update-group")
    if not consumer:
        print("❌ No se pudo conectar a Kafka para delivery_updated")
        return

    topic = os.getenv("KAFKA_TOPIC_DELIVERY_UPDATE", "delivery_updated")
    print(f"📡 Suscribiéndose a tópico: {topic}")
    consumer.subscribe([topic])

    while True:
        try:
            msg = consumer.poll(1.0)
            if msg is None:
                continue

            if msg.error():
                print(f"Kafka error: {msg.error()}")
                continue

            value_raw = msg.value()
            if not value_raw:
                print("⚠️ Mensaje sin valor")
                continue

            data = json.loads(value_raw.decode("utf-8"))
            email_anterior = data.get("email_anterior")
            update = data.get("update", {})

            if not email_anterior:
                print("⚠️ No se recibió email_anterior")
                continue

            db: Session = next(get_db())
            user = db.query(User).filter_by(email=email_anterior).first()

            if not user:
                print(f"⚠️ Usuario no encontrado con email: {email_anterior}")
                continue

            nuevo_username = update.get("username")
            if nuevo_username:
                user.username = nuevo_username
                db.commit()
                print(f"✅ Nombre actualizado en auth-service para: {user.email}")
            else:
                print("⚠️ No se recibió nuevo username, nada que actualizar.")
        except Exception as e:
            print(f"❌ Error al procesar evento delivery_updated: {e}")
            traceback.print_exc()
            
def consume_delivery_deleted():
    print("📥 Iniciando consumidor Kafka para delivery_deleted")

    consumer = conectar_kafka("auth-delivery-delete-group")
    if not consumer:
        print("❌ No se pudo conectar a Kafka para delivery_deleted")
        return

    topic = os.getenv("KAFKA_TOPIC_DELIVERY_DELETE", "delivery-deleted")
    print(f"📡 Suscribiéndose a tópico: {topic}")
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Kafka error: {msg.error()}")
            continue

        try:
            data = json.loads(msg.value().decode("utf-8"))
            email = data.get("email")

            if not email:
                print("⚠️ No se recibió email para eliminar")
                continue

            db: Session = next(get_db())
            user = db.query(User).filter_by(email=email).first()

            if not user:
                print(f"⚠️ Usuario no encontrado con email: {email}")
            else:
                db.delete(user)
                db.commit()
                print(f"✅ Usuario eliminado en auth-service para email: {email}")

        except Exception as e:
            print(f"❌ Error al procesar evento delivery_deleted: {e}")
            traceback.print_exc()
