document.addEventListener("DOMContentLoaded", function () {
  var postContent = document.getElementById("post-content");
  // Cari semua heading yang tersedia
  var allHeadings = ["h2", "h3"];
  var availableHeadings = allHeadings.filter((h) =>
    postContent.querySelector(h)
  );
  var headingsSelector = availableHeadings.join(", ");
  var headings = postContent.querySelectorAll(headingsSelector);

  var toc = document.getElementById("table-of-contents");
  var currentList = document.createElement("ul");
  toc.appendChild(currentList);
  var listStack = [currentList];
  var lastLevel = 0; // Mulai dari 0 untuk menangani level pertama heading

  headings.forEach(function (heading, index) {
    var level = parseInt(heading.tagName.substring(1), 10);
    var id =
      heading.textContent
        .replace(/\s+/g, "-")
        .replace(/:/g, "")
        .replace(/[^a-zA-Z0-9\-_]/g, "")
        .toLowerCase() +
      "-" +
      index;

    heading.id = id;

    // Penanganan untuk nested list berdasarkan level heading
    while (level > lastLevel) {
      var newList = document.createElement("ul");
      if (!listStack[lastLevel].lastElementChild) {
        var tempLi = document.createElement("li");
        listStack[lastLevel].appendChild(tempLi);
      }
      listStack[lastLevel].lastElementChild.appendChild(newList);
      listStack.push(newList);
      lastLevel++;
    }

    while (level < lastLevel) {
      listStack.pop();
      lastLevel--;
    }

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", "#" + id);
    a.textContent = heading.textContent;
    li.appendChild(a);
    listStack[listStack.length - 1].appendChild(li);
  });

  // Add click event listeners to ToC links
  document.querySelectorAll("#table-of-contents a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor behavior

      var href = this.getAttribute("href");
      var targetElement = document.querySelector(href);

      if (targetElement) {
        // Scroll to the target element with 50px offset from the top
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          // behavior: 'smooth'
        });
      }
    });
  });

  // Highlight the active item in the ToC
  function highlightActiveTocItem() {
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    var offset = 100; // Offset from the top
    var selectedHeadingId = null;

    headings.forEach(function (heading, index) {
      var headingTop = heading.offsetTop;

      // Check if the heading is at or above the scroll position with the offset
      if (scrollPosition >= headingTop - offset) {
        selectedHeadingId = heading.id;
      }
    });

    document
      .querySelectorAll("#table-of-contents a")
      .forEach(function (tocLink) {
        if (
          selectedHeadingId &&
          tocLink.getAttribute("href") === "#" + selectedHeadingId
        ) {
          tocLink.classList.add("active-toc-item");
        } else {
          tocLink.classList.remove("active-toc-item");
        }
      });
  }
  window.addEventListener("scroll", highlightActiveTocItem);
});
