from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import (
    Product,
    Category,
    Cart,
    CartItem,
    Order,
    OrderItem,
)
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout


def home(request):
    products = Product.objects.all()[:8]
    categories = Category.objects.all()

    return render(
        request,
        "home.html",
        {
            "products": products,
            "categories": categories,
        }
    )


def products(request):
    products = Product.objects.all()
    categories = Category.objects.all()

    search = request.GET.get("search", "").strip()
    category_id = request.GET.get("category", "").strip()

    if search:
        products = products.filter(name__icontains=search)

    if category_id:
        products = products.filter(category_id=category_id)

    return render(
        request,
        "products.html",
        {
            "products": products,
            "categories": categories,
            "search": search,
        }
    )


def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    return render(
        request,
        "product_detail.html",
        {
            "product": product,
        }
    )


@login_required
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    if product.stock <= 0:
        return redirect("product_detail", product_id=product.id)

    cart, created = Cart.objects.get_or_create(user=request.user)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if not created:
        if cart_item.quantity < product.stock:
            cart_item.quantity += 1
            cart_item.save()
    else:
        cart_item.quantity = 1
        cart_item.save()

    return redirect("cart")


@login_required
def cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    items = cart.items.select_related("product")

    total = 0

    for item in items:
        item.subtotal = item.product.price * item.quantity
        total += item.subtotal

    return render(
        request,
        "cart.html",
        {
            "cart": cart,
            "items": items,
            "total": total
        }
    )


@login_required
def remove_from_cart(request, item_id):
    item = get_object_or_404(
        CartItem,
        id=item_id,
        cart__user=request.user
    )

    item.delete()

    return redirect("cart")


@login_required
def increase_cart_quantity(request, item_id):
    item = get_object_or_404(
        CartItem,
        id=item_id,
        cart__user=request.user
    )

    if item.quantity < item.product.stock:
        item.quantity += 1
        item.save()

    return redirect("cart")


@login_required
def decrease_cart_quantity(request, item_id):
    item = get_object_or_404(
        CartItem,
        id=item_id,
        cart__user=request.user
    )

    if item.quantity > 1:
        item.quantity -= 1
        item.save()
    else:
        item.delete()

    return redirect("cart")
@login_required
def checkout(request):

    cart, created = Cart.objects.get_or_create(user=request.user)

    items = cart.items.select_related("product")

    if not items.exists():
        return redirect("cart")

    total = 0

    for item in items:
        item.subtotal = item.product.price * item.quantity
        total += item.subtotal

    if request.method == "POST":

        phone = request.POST.get("phone", "").strip()
        address = request.POST.get("address", "").strip()
        city = request.POST.get("city", "").strip()
        pincode = request.POST.get("pincode", "").strip()

        if not phone or not address or not city or not pincode:

            return render(
                request,
                "checkout.html",
                {
                    "items": items,
                    "total": total
                }
            )

        with transaction.atomic():

            order = Order.objects.create(
                user=request.user,
                phone=phone,
                address=address,
                city=city,
                pincode=pincode,
                total_amount=total,
                status="Pending"
            )

            for item in items:

                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

                item.product.stock -= item.quantity
                item.product.save()

            items.delete()

        return redirect(
            "order_success",
            order_id=order.id
        )

    return render(
        request,
        "checkout.html",
        {
            "items": items,
            "total": total
        }
    )
@login_required
def order_success(request, order_id):

    order = get_object_or_404(
        Order,
        id=order_id,
        user=request.user
    )

    return render(
        request,
        "order_success.html",
        {
            "order": order,
        }
    )
@login_required
def my_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).order_by("-created_at")

    return render(
        request,
        "my_orders.html",
        {
            "orders": orders,
        }
    )


@login_required
def order_detail(request, order_id):
    order = get_object_or_404(
        Order,
        id=order_id,
        user=request.user
    )

    items = order.items.select_related("product")

    # Calculate subtotal for each product
    for item in items:
        item.subtotal = item.price * item.quantity

    return render(
        request,
        "order_detail.html",
        {
            "order": order,
            "items": items,
        }
    )
from django.contrib.admin.views.decorators import staff_member_required


@staff_member_required
def admin_orders(request):

    orders = Order.objects.select_related(
        "user"
    ).prefetch_related(
        "items__product"
    ).order_by("-created_at")

    return render(
        request,
        "admin_orders.html",
        {
            "orders": orders,
        }
    )
@staff_member_required
def update_order_status(request, order_id):

    order = get_object_or_404(
        Order,
        id=order_id
    )

    if request.method == "POST":

        new_status = request.POST.get("status")

        valid_statuses = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled",
        ]

        if new_status in valid_statuses:

            order.status = new_status
            order.save()

    return redirect("admin_orders")
@staff_member_required
def admin_order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    items = order.items.select_related("product")

    # Calculate subtotal for each product
    for item in items:
        item.subtotal = item.price * item.quantity

    # Valid order statuses
    valid_statuses = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
    ]

    # Update order status
    if request.method == "POST":
        new_status = request.POST.get("status")

        if new_status in valid_statuses:
            order.status = new_status
            order.save()

        return redirect("admin_order_detail", order_id=order.id)

    return render(
        request,
        "admin_order_detail.html",
        {
            "order": order,
            "items": items,
        }
    )
@staff_member_required
def admin_dashboard(request):

    total_orders = Order.objects.count()

    total_customers = User.objects.filter(
        is_staff=False
    ).count()

    total_products = Product.objects.count()

    total_sales = sum(
        order.total_amount
        for order in Order.objects.exclude(
            status="Cancelled"
        )
    )

    pending_orders = Order.objects.filter(
        status="Pending"
    ).count()

    confirmed_orders = Order.objects.filter(
        status="Confirmed"
    ).count()

    shipped_orders = Order.objects.filter(
        status="Shipped"
    ).count()

    delivered_orders = Order.objects.filter(
        status="Delivered"
    ).count()

    low_stock_products = Product.objects.filter(
        stock__lte=5
    ).order_by("stock")

    recent_orders = Order.objects.select_related(
        "user"
    ).order_by(
        "-created_at"
    )[:5]

    context = {
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
        "total_sales": total_sales,

        "pending_orders": pending_orders,
        "confirmed_orders": confirmed_orders,
        "shipped_orders": shipped_orders,
        "delivered_orders": delivered_orders,

        "low_stock_products": low_stock_products,
        "recent_orders": recent_orders,
    }

    return render(
        request,
        "admin_dashboard.html",
        context
    )
def register(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":

        form = UserCreationForm(request.POST)

        if form.is_valid():

            user = form.save()

            login(request, user)

            return redirect("home")

    else:

        form = UserCreationForm()

    return render(
        request,
        "register.html",
        {
            "form": form
        }
    )


def logout_user(request):

    logout(request)

    return redirect("home")