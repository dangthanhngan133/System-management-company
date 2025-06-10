from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Order, OrderDetail
from .serializers import OrderSerializer, OrderDetailSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin can see all orders, users can only see their own
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status == 'Pending':
            order.status = 'Cancelled'
            order.save()
            return Response({'status': 'order cancelled'})
        return Response(
            {'error': 'Can only cancel pending orders'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        order = self.get_object()
        if order.status == 'Pending':
            order.status = 'Completed'
            order.save()
            return Response({'status': 'order completed'})
        return Response(
            {'error': 'Can only complete pending orders'},
            status=status.HTTP_400_BAD_REQUEST
        ) 