from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    SHIPPED = "shipped"
    DELIVERED = "delivered"

class Merchant(Base):
    __tablename__ = "merchants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    api_key = Column(String, unique=True, index=True) # Internal API key
    
    # WhatsApp Config (Tier 3 support)
    whatsapp_api_token = Column(String, nullable=True)
    whatsapp_phone_number_id = Column(String, nullable=True)
    tier = Column(Integer, default=1) # 1=Shared, 2=Pool, 3=Own
    
    orders = relationship("Order", back_populates="merchant")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(Integer, ForeignKey("merchants.id"), nullable=True) # Nullable for backward compat/default
    shopify_order_id = Column(String, unique=True, index=True)
    order_number = Column(String, index=True)
    customer_phone = Column(String)
    customer_name = Column(String)
    total_price = Column(String)
    currency = Column(String)
    financial_status = Column(String) 
    fulfillment_status = Column(String)
    
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    
    # Delivery Details
    delivery_slot = Column(String, nullable=True)
    delivery_instructions = Column(Text, nullable=True)
    tracking_number = Column(String, nullable=True)
    tracking_url = Column(String, nullable=True)
    courier_name = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    merchant = relationship("Merchant", back_populates="orders")
    logs = relationship("MessageLog", back_populates="order")

class MessageLog(Base):
    __tablename__ = "message_logs"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    message_type = Column(String) 
    status = Column(String) 
    whatsapp_message_id = Column(String)
    content = Column(String)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="logs")

class Config(Base):
    __tablename__ = "configs"
    
    key = Column(String, primary_key=True, index=True)
    value = Column(String)
    description = Column(String)
