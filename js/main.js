$(document).ready(function () {
  // KIỂM TRA ĐĂNG KÝ
  $("#formDangKy").on("submit", function (e) {
    e.preventDefault();

    let ten = $("#ten").val();
    let ngaySinh = $("#ngaySinh").val();
    let email = $("#email").val();
    let matKhau = $("#matKhau").val();
    let dieuKhoan = $("#dieuKhoan").is(":checked");

    if (ten === "") {
      alert("Vui lòng nhập họ tên!");
      return;
    }

    if (ngaySinh === "") {
      alert("Vui lòng chọn ngày sinh!");
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    if (matKhau.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!dieuKhoan) {
      alert("Bạn phải đồng ý với điều khoản sử dụng!");
      return;
    }

    let thongBaoThanhCong = `
      ĐĂNG KÝ THÀNH CÔNG!
      --------------------
      Họ tên: ${ten}
      Ngày sinh: ${ngaySinh}
      Email: ${email}
      Mật khẩu: ${"*".repeat(matKhau.length)} (Đã mã hóa)
    `;

    alert(thongBaoThanhCong);
  });

  // ==========================================
  // SORT SÁCH TĂNG GIẢM
  // ==========================================
  const sortSelect = $("#sortBooks");
  const bookGrid = $("#book-Grid");

  // Chỉ bắt đầu khi ở trang có nhiều sách
  if (sortSelect.length > 0 && bookGrid.length > 0) {
    const originalBooks = bookGrid.children(".col").toArray();

    sortSelect.on("change", function () {
      const sortValue = $(this).val();
      let books = bookGrid.children(".col").toArray();

      if (sortValue === "newest") {
        bookGrid.empty().append(originalBooks);
        return;
      }

      books.sort(function (a, b) {
        const priceA = parseInt($(a).data("price"));
        const priceB = parseInt($(b).data("price"));

        if (sortValue === "asc") {
          return priceA - priceB;
        } else if (sortValue === "desc") {
          return priceB - priceA;
        }
      });

      bookGrid.empty().append(books);
    });

    // ==========================================
    // SORT THEO GIÁ
    // ==========================================
    const priceFilters = $("#price-filter a");

    priceFilters.on("click", function (e) {
      e.preventDefault();

      priceFilters.css("color", "");
      $(this).css("color", "#ff7b00");

      const minPrice = parseInt($(this).data("min"));
      const maxPrice = parseInt($(this).data("max"));

      bookGrid.children(".col").each(function () {
        const bookPrice = parseInt($(this).data("price"));

        if (bookPrice >= minPrice && bookPrice <= maxPrice) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  }

  // ==========================================
  // XỬ LÝ TRANG CATEGORIES (Click danh mục hiện sách)
  // ==========================================
  let $categoryLinks = $(".category-link");
  let $categoryGrid = $("#category-grid");
  let $categoryBooksGrid = $("#category-books-grid");
  let $categoryTitle = $("#category-title");
  let $btnBackCategories = $("#btn-back-categories");

  if ($categoryGrid.length > 0) {
    $categoryLinks.on("click", function (e) {
      e.preventDefault();

      let catName = $(this).data("name");

      $categoryGrid.fadeOut(200, function () {
        $categoryTitle.text(catName);
        $btnBackCategories.fadeIn(200);
        $categoryBooksGrid.fadeIn(300);
      });
    });

    $btnBackCategories.on("click", function () {
      $categoryBooksGrid.fadeOut(200, function () {
        $btnBackCategories.hide();
        $categoryTitle.text("CATEGORIES");
        $categoryGrid.fadeIn(300);
      });
    });
  }

  // ==========================================
  // XỬ LÝ TRANG AUTHORS (Click tác giả hiện sách)
  // ==========================================
  const $authorLinks = $(".author-link");
  const $authorGrid = $("#author-grid");
  const $authorBooksGrid = $("#author-books-grid");
  const $authorTitle = $("#author-title");
  const $btnBackAuthors = $("#btn-back-authors");

  if ($authorGrid.length > 0) {
    $authorLinks.on("click", function (e) {
      e.preventDefault();

      const authorName = $(this).data("name");
      $authorGrid.fadeOut(200, function () {
        $authorTitle.text(authorName);
        $btnBackAuthors.fadeIn(200);
        $authorBooksGrid.fadeIn(300);
      });
    });

    $btnBackAuthors.on("click", function () {
      $authorBooksGrid.fadeOut(200, function () {
        $btnBackAuthors.hide();
        $authorTitle.text("AUTHORS");
        $authorGrid.fadeIn(300);
      });
    });
  }

  // ==========================================
  // CART: TĂNG/GIẢM SỐ LƯỢNG + TÍNH TỔNG TIỀN
  // ==========================================
  const cartItems = $(".cart-item");

  const formatMoney = (n) => n.toLocaleString("vi-VN") + "đ";
  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  function updateCartCount() {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = $('a[href="cart.html"]');

    if (cartLink.length) {
      cartLink.html(`Cart <i class="bi bi-cart2"></i> (${total})`);
    }
  }

  // ==========================================
  // BOOKS: THÊM SÁCH VÀO GIỎ HÀNG
  // ==========================================
  $(".btn-add").on("click", function () {
    const card = $(this).closest(".product-card");
    const col = $(this).closest(".col");

    const book = {
      title: card.find(".book-title").text().trim(),
      author: card.find(".book-author").text().trim(),
      price: parseInt(col.data("price")),
      image: card.find(".product-img-box img").attr("src"),
      quantity: 1,
    };

    let cart = getCart();
    const oldBook = cart.find((item) => item.title === book.title);

    if (oldBook) {
      oldBook.quantity++;
    } else {
      cart.push(book);
    }

    saveCart(cart);
    updateCartCount();
    renderCart();
    alert("Đã thêm sách vào giỏ hàng!");
  });

  // ==========================================
  // CART PAGE
  // ==========================================
  const cartList = $(".cart-list");

  function updateTotal() {
    const subtotal = getCart().reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const shipping = subtotal === 0 || subtotal >= 300000 ? 0 : 30000;
    const grandTotal = subtotal + shipping;

    $("#subtotal").text(formatMoney(subtotal));
    $("#shipping").text(shipping === 0 ? "Free" : formatMoney(shipping));
    $("#discount").text(formatMoney(0));
    $("#grandTotal").text(formatMoney(grandTotal));
  }

  function renderCart() {
    if (!cartList.length) return;

    const cart = getCart();

    if (cart.length === 0) {
      cartList.html(`
          <div class="cart-card text-center">
            <i class="bi bi-cart-x" style="font-size: 50px; color: #ff7b00;"></i>
            <h3 class="mt-3">Your cart is empty</h3>
            <p class="text-light">You have not selected any books yet.</p>
            <a href="books.html" class="btn-continue mt-2">
              <i class="bi bi-arrow-left"></i> Continue shopping
            </a>
          </div>
        `);

      updateTotal();
      updateCartCount();
      return;
    }

    let html = "";

    cart.forEach((item, index) => {
      html += `
          <div class="cart-item" data-index="${index}">
            <div class="cart-product">
              <div class="cart-img-box">
                <img src="${item.image}" alt="${item.title}">
              </div>

              <div class="cart-book-info">
                <h4 class="cart-book-title">${item.title}</h4>
                <p class="cart-book-author">${item.author}</p>
                <p class="cart-book-price">${formatMoney(item.price)}</p>
              </div>
            </div>

            <div class="cart-actions">
              <div class="quantity-box">
                <button class="btn-minus">-</button>
                <input type="text" class="qty-input" value="${item.quantity}" readonly>
                <button class="btn-plus">+</button>
              </div>

              <div class="item-total">
                ${formatMoney(item.price * item.quantity)}
              </div>

              <button class="remove-btn">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `;
    });

    cartList.html(html);
    updateTotal();
    updateCartCount();
  }

  cartList.on("click", ".btn-plus, .btn-minus, .remove-btn", function () {
    const index = $(this).closest(".cart-item").data("index");
    let cart = getCart();

    if ($(this).hasClass("btn-plus")) {
      cart[index].quantity++;
    }

    if ($(this).hasClass("btn-minus") && cart[index].quantity > 1) {
      cart[index].quantity--;
    }

    if ($(this).hasClass("remove-btn")) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  });

  renderCart();

  // ==========================================
  // CHECKOUT MODAL
  // ==========================================
  const checkoutModal = $("#checkoutModal");

  if (checkoutModal.length > 0) {
    function clearCheckoutErrors() {
      $("#nameError, #phoneError, #emailError, #addressError").text("");
    }

    function validCheckoutForm() {
      clearCheckoutErrors();

      let ok = true;
      const name = $("#customerName").val().trim();
      const phone = $("#customerPhone").val().trim();
      const email = $("#customerEmail").val().trim();
      const address = $("#customerAddress").val().trim();

      if (name.length < 2) {
        $("#nameError").text("Please enter your full name.");
        ok = false;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        $("#phoneError").text("Phone number must have 10 digits.");
        ok = false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $("#emailError").text("Please enter a valid email.");
        ok = false;
      }

      if (address.length < 10) {
        $("#addressError").text("Please enter a detailed delivery address.");
        ok = false;
      }

      return ok;
    }

    function updateCheckoutModal() {
      const cart = getCart();
      let subtotal = 0;
      let html = "";

      cart.forEach((item) => {
        subtotal += item.price * item.quantity;

        html += `
            <div class="checkout-book">
              <img src="${item.image}" alt="${item.title}" />
              <div>
                <h4>${item.title}</h4>
                <p>${item.author}</p>
                <p>${item.quantity} x ${formatMoney(item.price)}</p>
              </div>
            </div>
          `;
      });

      const shipping = subtotal === 0 || subtotal >= 300000 ? 0 : 30000;
      const grandTotal = subtotal + shipping;

      $("#modalOrderItems").html(html);
      $("#modalSubtotal").text(formatMoney(subtotal));
      $("#modalShipping").text(shipping === 0 ? "Free" : formatMoney(shipping));
      $("#modalShippingFee").text(
        shipping === 0 ? "Free" : formatMoney(shipping),
      );
      $("#modalDiscount").text(formatMoney(0));
      $("#modalGrandTotal").text(formatMoney(grandTotal));
    }

    checkoutModal.on("show.bs.modal", function (e) {
      if (getCart().length === 0) {
        e.preventDefault();
        alert("Your cart is empty!");
        return;
      }

      updateCheckoutModal();
    });

    $("#placeOrderBtn").on("click", function () {
      if (!validCheckoutForm()) return;

      localStorage.removeItem("cart");

      bootstrap.Modal.getInstance(
        document.getElementById("checkoutModal"),
      ).hide();

      new bootstrap.Modal(document.getElementById("orderSuccessModal")).show();

      renderCart();
      updateCartCount();
    });
  }

  updateCartCount();
});

const bookLinks = {
  1: "../html/books/AnnaKarenina.html",
  2: "../html/books/CallOfTheWild.html",
  3: "../html/books/EastOfEden.html",
  4: "../html/books/Homodeus.html",
  5: "../html/books/Homosapiens.html",
  6: "../html/books/OfMiceAndMan.html",
  7: "../html/books/TheAlchemist.html",
  8: "../html/books/TheCountOfMonteristo.html",
  9: "../html/books/ThePilgrimage.html",
  10: "../html/books/TheRiseAndFallOfTheDinosaur.html",
  11: "../html/books/TheStoryOfBirds.html",
  12: "../html/books/ToBuildAFire.html",
  13: "../html/books/TwentyYearsLater.html",
  14: "../html/books/WarAndPeace.html",
};

function goDetail(id) {
  window.location.href = bookLinks[id];
}
