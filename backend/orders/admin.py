from django.contrib import admin
from .models import Order, OrderDetail

class OrderDetailInline(admin.TabularInline):
    model = OrderDetail
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order_date', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'order_date')
    search_fields = ('user__username', 'id')
    inlines = [OrderDetailInline]

@admin.register(OrderDetail)
class OrderDetailAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order__status',)
    search_fields = ('order__id', 'product__name')
    