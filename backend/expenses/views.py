from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from .models import Expense
from .serializers import ExpenseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework import status


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'user']
    ordering_fields = ['date', 'amount']
    
    def get_queryset(self):
        queryset = Expense.objects.all()
        user = self.request.user
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Expense.objects.all()
        return Expense.objects.filter(user=user)


class ExpenseSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.is_staff:
            expenses = Expense.objects.all()
        else:
            expenses = Expense.objects.filter(user=user)
        
        summary = expenses.values('category').annotate(total=Sum('amount'))
        return Response(summary)


@api_view(['POST'])
def get_token_for_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)
    
    user = User.objects.filter(username=username).first()
    if user and user.check_password(password):
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        })
    return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)