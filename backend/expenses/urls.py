from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseRetrieveUpdateDestroyView,
    ExpenseSummaryView,
    register_user,
)

urlpatterns = [
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseRetrieveUpdateDestroyView.as_view(), name='expense-detail'),
    path('summary/', ExpenseSummaryView.as_view(), name='expense-summary'),
    path('register/', register_user, name='register'),
]
