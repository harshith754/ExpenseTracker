from rest_framework import serializers
from .models import Expense
from django.contrib.auth.models import User

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'category', 'date', 'notes', 'user']
        read_only_fields = ['user']