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

// Chỉ bắt đầu khi ở trang giỏ hàng
if (cartItems.length > 0) {

  function formatMoney(number) {
    return number.toLocaleString("vi-VN") + "đ";
  }

  function updateCartTotal() {
  let subtotal = 0;

  // Lấy lại danh sách sách hiện tại sau mỗi lần xóa
  const currentCartItems = $(".cart-item");

  currentCartItems.each(function () {
    const price = parseInt($(this).data("price"));
    const qty = parseInt($(this).find(".qty-input").val());
    const itemTotal = price * qty;

    $(this).find(".item-total").text(formatMoney(itemTotal));
    subtotal += itemTotal;
  });

  const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;
  const discount = 0;
  const grandTotal = subtotal + shipping - discount;

  $("#subtotal").text(formatMoney(subtotal));
  $("#shipping").text(shipping === 0 ? "Free" : formatMoney(shipping));
  $("#discount").text(formatMoney(discount));
  $("#grandTotal").text(formatMoney(grandTotal));

  // Nếu giỏ hàng rỗng
  if (currentCartItems.length === 0) {
    $(".cart-list").html(`
      <div class="cart-card text-center">
        <i class="bi bi-cart-x" style="font-size: 50px; color: #ff7b00;"></i>
        <h3 class="mt-3">Your cart is empty</h3>
        <p class="text-light">You have not selected any books yet.</p>
        <a href="books.html" class="btn-continue mt-2">
          <i class="bi bi-arrow-left"></i> Continue shopping
        </a>
      </div>
    `);
  }
}

  $(".btn-plus").on("click", function () {
    const qtyInput = $(this).siblings(".qty-input");
    const currentQty = parseInt(qtyInput.val());

    qtyInput.val(currentQty + 1);
    updateCartTotal();
  });

  $(".btn-minus").on("click", function () {
    const qtyInput = $(this).siblings(".qty-input");
    const currentQty = parseInt(qtyInput.val());

    if (currentQty > 1) {
      qtyInput.val(currentQty - 1);
      updateCartTotal();
    }
  });

  $(".remove-btn").on("click", function () {
    $(this).closest(".cart-item").remove();
    updateCartTotal();
  });

  updateCartTotal();
}

  // ==========================================
  // CHECKOUT MODAL: HIỂN THỊ SÁCH + KIỂM TRA FORM
  // ==========================================
  const checkoutModal = $("#checkoutModal");

  // Chỉ bắt đầu khi có modal thanh toán
  if (checkoutModal.length > 0) {

    function clearCheckoutErrors() {
      $("#nameError").text("");
      $("#phoneError").text("");
      $("#emailError").text("");
      $("#addressError").text("");
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
      let subtotal = 0;
      let orderHTML = "";
      const currentCartItems = $(".cart-item");

      currentCartItems.each(function () {
        const title = $(this).find(".cart-book-title").text();
        const author = $(this).find(".cart-book-author").text();
        const img = $(this).find(".cart-img-box img").attr("src");
        const price = parseInt($(this).data("price"));
        const qty = parseInt($(this).find(".qty-input").val());
        const itemTotal = price * qty;

        subtotal += itemTotal;

        orderHTML += `
          <div class="checkout-book">
            <img src="${img}" alt="${title}" />
            <div>
              <h4>${title}</h4>
              <p>${author}</p>
              <p>${qty} x ${formatMoney(price)}</p>
            </div>
          </div>
        `;
      });

      const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;
      const discount = 0;
      const grandTotal = subtotal + shipping - discount;

      $("#modalOrderItems").html(orderHTML);
      $("#modalSubtotal").text(formatMoney(subtotal));
      $("#modalShipping").text(shipping === 0 ? "Free" : formatMoney(shipping));
      $("#modalShippingFee").text(shipping === 0 ? "Free" : formatMoney(shipping));
      $("#modalDiscount").text(formatMoney(discount));
      $("#modalGrandTotal").text(formatMoney(grandTotal));
    }

    $("#checkoutModal").on("show.bs.modal", function (e) {
      const currentCartItems = $(".cart-item");

      if (currentCartItems.length === 0) {
        e.preventDefault();
        alert("Your cart is empty!");
        return;
      }

      updateCheckoutModal();
    });

    $("#placeOrderBtn").on("click", function () {
      if (validCheckoutForm()) {
        const checkoutModalObj = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
        checkoutModalObj.hide();

        const orderSuccessModal = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
        orderSuccessModal.show();
      }
    });
  }

});