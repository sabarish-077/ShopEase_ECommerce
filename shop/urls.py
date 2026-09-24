from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),

    path("products/", views.products, name="products"),

    path(
        "product/<int:product_id>/",
        views.product_detail,
        name="product_detail"
    ),

    path(
        "cart/",
        views.cart,
        name="cart"
    ),

    path(
        "cart/add/<int:product_id>/",
        views.add_to_cart,
        name="add_to_cart"
    ),

    path(
        "cart/remove/<int:item_id>/",
        views.remove_from_cart,
        name="remove_from_cart"
    ),

    path(
        "cart/increase/<int:item_id>/",
        views.increase_cart_quantity,
        name="increase_cart_quantity"
    ),

    path(
        "cart/decrease/<int:item_id>/",
        views.decrease_cart_quantity,
        name="decrease_cart_quantity"
    ),

    path(
        "checkout/",
        views.checkout,
        name="checkout"
    ),

    path(
        "order-success/<int:order_id>/",
        views.order_success,
        name="order_success"
    ),
    path("orders/", views.my_orders, name="my_orders"),

path(
    "orders/<int:order_id>/",
    views.order_detail,
    name="order_detail"
),
path(
    "admin-orders/",
    views.admin_orders,
    name="admin_orders"
),
path(
    "admin-orders/update/<int:order_id>/",
    views.update_order_status,
    name="update_order_status"
),
path(
    "admin-orders/<int:order_id>/",
    views.admin_order_detail,
    name="admin_order_detail"
),
path(
    "admin-dashboard/",
    views.admin_dashboard,
    name="admin_dashboard"
),
path(
    "register/",
    views.register,
    name="register"
),

path(
    "logout/",
    views.logout_user,
    name="logout"
),
]
