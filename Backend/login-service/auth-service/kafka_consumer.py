import os
import time
import json
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
            return consumer
        except Exception as e:
            print(f"❌ Intento {i+1}/10: Kafka no disponible - {e}")
            time.sleep(5)
    return None

def consume_user_created():
    print("📥 Iniciando consumidor Kafka para customer_created")
    for i in range(10):
        try:
            print("🔧 Conectando a Kafka en:", os.getenv("KAFKA_BROKER"))
            consumer = Consumer({
                'bootstrap.servers': os.getenv("KAFKA_BROKER", "kafka:9092"),
                'group.id': 'auth-group',
                'auto.offset.reset': 'earliest'
            })
            print("✅ Conexión establecida con Kafka")
            break
        except Exception as e:
            print(f"❌ Intento {i+1}/10: Kafka no disponible aún - {e}")
            time.sleep(5)
    else:
        print("❌ No se pudo conectar a Kafka luego de 10 intentos.")
        return

    topic = os.getenv("KAFKA_TOPIC_CREATE", "customer_created")
    print(f"📡 Suscribiéndose al tópico: {topic}")
    consumer.subscribe([topic])

    # Bucle de consumo
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
            
def consume_user_deleted():
    print("📥 Iniciando consumidor Kafka para customer_deleted")

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
