$(document).ready(function () {
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
});
