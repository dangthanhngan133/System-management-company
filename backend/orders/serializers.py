from rest_framework import serializers
from .models import Order, OrderDetail
from products.serializers import ProductSerializer

class OrderDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderDetail
        fields = ['id', 'product', 'product_id', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True, required=False)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'username', 'order_date', 'total_amount', 'status', 'details', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        order = Order.objects.create(**validated_data)
        
        for detail_data in details_data:
            OrderDetail.objects.create(order=order, **detail_data)
        
        return order

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)
        
        # Update order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update order details if provided
        if details_data is not None:
            # Delete existing details
            instance.details.all().delete()
            # Create new details
            for detail_data in details_data:
                OrderDetail.objects.create(order=instance, **detail_data)

        return instance 