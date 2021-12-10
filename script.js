(function ($) {
  "use strict";

  $(document).ready(function () {
    "use strict";

    $("#fullpage").fullpage({
      autoScrolling: true,
      navigation: true,
      keyboardScrolling: true,
      navigationPosition: "right",
      scrollOverflow: true,
      touchSensitivity: 30,
      scrollHorizontally: true,
      autoScrolling: true,
      anchors: [
        "home-p",
        "about-p",
        "ml",
        "data-p",
        "lang-p",
        "model-p",
        "twitter-trends",
        "twitter-trends-2",
        "twitter-trends-3",
        "model-demo",
        "footer-s",
      ],
      normalScrollElements: "#footer",
    });

    var progressPath = document.querySelector(".progress-wrap path");
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "none";
    progressPath.style.strokeDasharray = pathLength + " " + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "stroke-dashoffset 10ms linear";
    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;
    };
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 10;
    var duration = 300;
    jQuery(window).on("scroll", function () {
      if (jQuery(this).scrollTop() > offset) {
        jQuery(".progress-wrap").addClass("active-progress");
        jQuery(".downbounce").addClass("active-progress");
      } else {
        jQuery(".progress-wrap").removeClass("active-progress");
      }
    });
    jQuery(".progress-wrap").on("click", function (event) {
      event.preventDefault();
      jQuery("html, body").animate({ scrollTop: 0 }, duration);
      return false;
    });
  });
})(jQuery);

// $(function () {
//   $("a[href*=#]").on("click", function (e) {
//     e.preventDefault();
//     $("html, body").animate(
//       { scrollTop: $($(this).attr("href")).offset().top },
//       500,
//       "linear"
//     );
//   });
// });

submitButton = document.getElementById("textSubmit");
submitButton.addEventListener("click", function (event) {
  var text = document.getElementById("textForm").value;
  console.log(text);
});

var data;

submitButton.addEventListener("click", function (event) {
  runTime = async () => {
    function sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    document.getElementById("result").innerHTML = "————";
    document.getElementById("result").style.backgroundColor = "transparent";
    document.getElementById("textSubmit").style.backgroundColor = "#1f2029";
    document.getElementById("textSubmit").style.color = "#fff";
    document.getElementById("large-result").style.color = "#fff";
    document.getElementById("textSubmit").disabled = true;

    var dots = ".";
    loadingdots = window.setInterval(function () {
      document.getElementById("large-result").innerHTML = "Generating" + dots;
      dots += ".";
      if (dots.length > 3) dots = ".";
    }, 300);

    document.getElementById("stats-1-n").style = "--size: " + 0;
    document.getElementById("stats-1-r").style = "--size: " + 0;
    document.getElementById("stats-1-t").style = "--size: " + 0;

    document.getElementById("stats-2-n").style = "--size: " + 0;
    document.getElementById("stats-2-r").style = "--size: " + 0;
    document.getElementById("stats-2-t").style = "--size: " + 0;

    document.getElementById("stats-3-n").style = "--size: " + 0;
    document.getElementById("stats-3-r").style = "--size: " + 0;
    document.getElementById("stats-3-t").style = "--size: " + 0;
    document.getElementById("textSubmit").value = "Loading";

    var text = document.getElementById("textForm").value;
    const response = await fetch("https://api.lang.staging.cam/fetch.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: "Text=" + encodeURIComponent(text),
    });
    data = await response.json();
    console.log(data);
    var r = parseInt(data.e);
    console.log(r);
    var text = "Neutral";
    var color = "#2ecc71";
    if (r == 1) {
      text = "General";
      color = "#f8ab37";
    } else if (r == 2) {
      text = "Terrorism";
      color = "#da2c4d";
    }
    document.getElementById("result").innerHTML = text;
    document.getElementById("result").style.backgroundColor = color;
    document.getElementById("large-result").innerHTML = text;
    document.getElementById("large-result").style.color = color;

    // charts
    document.getElementById("stats-1-n").style =
      "--size: " + data.m1[0] + ";--color: #2ecc71";
    document.getElementById("stats-1-r").style =
      "--size: " + data.m1[1] + ";--color: #f8ab37";
    document.getElementById("stats-1-t").style =
      "--size: " + data.m1[2] + ";--color: #da2c4d";

    document.getElementById("stats-2-n").style =
      "--size: " + data.m2[0] + ";--color: #2ecc71";
    document.getElementById("stats-2-r").style =
      "--size: " + data.m2[1] + ";--color: #f8ab37";
    document.getElementById("stats-2-t").style =
      "--size: " + data.m2[2] + ";--color: #da2c4d";

    document.getElementById("stats-3-n").style =
      "--size: " + data.m3[0] + ";--color: #2ecc71";
    document.getElementById("stats-3-r").style =
      "--size: " + data.m3[1] + ";--color: #f8ab37";
    document.getElementById("stats-3-t").style =
      "--size: " + data.m3[2] + ";--color: #da2c4d";

    //button
    document.getElementById("textSubmit").style.backgroundColor = "#fff";
    document.getElementById("textSubmit").value = "Submit";
    document.getElementById("textSubmit").style.color = "#1f2029";
    document.getElementById("textSubmit").disabled = false;
    window.clearInterval(loadingdots);

    document.getElementById("model-1-caption").innerHTML = "Model 1";
    document.getElementById("model-2-caption").innerHTML = "Model 2";
    document.getElementById("model-3-caption").innerHTML = "Model 3";
  };
  runTime();
});

submitButton.addEventListener("touchstart", function (event) {
  runTime = async () => {
    function sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    document.getElementById("result").innerHTML = "————";
    document.getElementById("result").style.backgroundColor = "transparent";
    document.getElementById("textSubmit").style.backgroundColor = "#1f2029";
    document.getElementById("textSubmit").style.color = "#fff";
    document.getElementById("large-result").style.color = "#fff";
    document.getElementById("textSubmit").disabled = true;

    var dots = ".";
    loadingdots = window.setInterval(function () {
      document.getElementById("large-result").innerHTML = "Generating" + dots;
      dots += ".";
      if (dots.length > 3) dots = ".";
    }, 300);

    document.getElementById("stats-1-n").style = "--size: " + 0;
    document.getElementById("stats-1-r").style = "--size: " + 0;
    document.getElementById("stats-1-t").style = "--size: " + 0;

    document.getElementById("stats-2-n").style = "--size: " + 0;
    document.getElementById("stats-2-r").style = "--size: " + 0;
    document.getElementById("stats-2-t").style = "--size: " + 0;

    document.getElementById("stats-3-n").style = "--size: " + 0;
    document.getElementById("stats-3-r").style = "--size: " + 0;
    document.getElementById("stats-3-t").style = "--size: " + 0;
    document.getElementById("textSubmit").value = "Loading";

    var text = document.getElementById("textForm").value;
    const response = await fetch("https://api.lang.staging.cam/fetch.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: "Text=" + encodeURIComponent(text),
    });
    data = await response.json();
    console.log(data);
    var r = parseInt(data.e);
    console.log(r);
    var text = "Neutral";
    var color = "#2ecc71";
    if (r == 1) {
      text = "General";
      color = "#f8ab37";
    } else if (r == 2) {
      text = "Terrorism";
      color = "#da2c4d";
    }
    document.getElementById("result").innerHTML = text;
    document.getElementById("result").style.backgroundColor = color;
    document.getElementById("large-result").innerHTML = text;
    document.getElementById("large-result").style.color = color;

    // charts
    document.getElementById("stats-1-n").style =
      "--size: " + data.m1[0] + ";--color: #2ecc71";
    document.getElementById("stats-1-r").style =
      "--size: " + data.m1[1] + ";--color: #f8ab37";
    document.getElementById("stats-1-t").style =
      "--size: " + data.m1[2] + ";--color: #da2c4d";

    document.getElementById("stats-2-n").style =
      "--size: " + data.m2[0] + ";--color: #2ecc71";
    document.getElementById("stats-2-r").style =
      "--size: " + data.m2[1] + ";--color: #f8ab37";
    document.getElementById("stats-2-t").style =
      "--size: " + data.m2[2] + ";--color: #da2c4d";

    document.getElementById("stats-3-n").style =
      "--size: " + data.m3[0] + ";--color: #2ecc71";
    document.getElementById("stats-3-r").style =
      "--size: " + data.m3[1] + ";--color: #f8ab37";
    document.getElementById("stats-3-t").style =
      "--size: " + data.m3[2] + ";--color: #da2c4d";

    //button
    document.getElementById("textSubmit").style.backgroundColor = "#fff";
    document.getElementById("textSubmit").value = "Submit";
    document.getElementById("textSubmit").style.color = "#1f2029";
    document.getElementById("textSubmit").disabled = false;
    window.clearInterval(loadingdots);

    document.getElementById("model-1-caption").innerHTML = "Model 1";
    document.getElementById("model-2-caption").innerHTML = "Model 2";
    document.getElementById("model-3-caption").innerHTML = "Model 3";
  };
  runTime();
});
// $(function () {
//   $(document).scroll(function () {
//     var $title = $("#title-1");
//     var $nav = $("#navbarmain");

//     if ($(this).scrollTop() <= $nav.height()) {
//       $nav.removeClass("nav-scrolled");
//       $nav.addClass("un-scrolled");
//     } else {
//       $nav.addClass("nav-scrolled");
//       $nav.removeClass("un-scrolled");
//     }
//   });
// });
var $nav = $("#navbarmain");

if (window.location.hash == "" || window.location.hash == "#home-p") {
  $nav.removeClass("nav-scrolled");
  $nav.addClass("un-scrolled");
} else {
  $nav.removeClass("un-scrolled");
  $nav.addClass("nav-scrolled");
}

window.onhashchange = function () {
  var $nav2 = $("#navbarmain");
  if (window.location.hash == "" || window.location.hash == "#home-p") {
    $nav2.removeClass("nav-scrolled");
    $nav2.addClass("un-scrolled");
  } else {
    $nav2.removeClass("un-scrolled");
    $nav2.addClass("nav-scrolled");
  }
};

function tabToggle(myself) {
  var item = document.getElementById(myself.dataset.controls);
  for (var i = 0; i < item.parentNode.children.length; i++) {
    item.parentNode.children[i].style.display = "none";
  }
  item.style.display = "block";
  for (var i = 0; i < myself.parentNode.children.length; i++) {
    myself.parentNode.children[i].classList.remove("active-select");
  }
  myself.classList.add("active-select");
}
function collapseDiv(event) {
  var item = document.getElementById(event.dataset.controls);
  var hidelm = document.querySelectorAll(".collapse-text");
  for (var i = 0; i < hidelm.length; i++) {
    if (!hidelm[i].isSameNode(item)) {
      hidelm[i].classList.add("hidden");
    }
  }
  item.classList.toggle("hidden");
  var item2 = document.getElementById(event.dataset.arrow);
  var hidelm = document.querySelectorAll(".arrow");
  for (var i = 0; i < hidelm.length; i++) {
    if (!hidelm[i].isSameNode(item2)) {
      hidelm[i].classList.remove("down");
    }
  }
  item2.classList.toggle("down");
}
