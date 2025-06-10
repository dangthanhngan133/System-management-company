from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[
        ('available', 'Available'),
        ('out_of_stock', 'Out of Stock'),
        ('discontinued', 'Discontinued')
    ], default='available')
    features = models.JSONField(default=dict)
    specifications = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
