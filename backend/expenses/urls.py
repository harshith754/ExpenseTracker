from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', views.ExpenseRetrieveUpdateDestroyView.as_view(), name='expense-detail'),
    path('summary/', views.ExpenseSummaryView.as_view(), name='expense-summary'),
]
 