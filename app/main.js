// Nusantara in Numbers — client logic: charts, sortable tables, search, year switcher.
(function () {
  var D = window.NUSANTARA_DATA;
  function $(id) { return document.getElementById(id); }
  function drawLine(canvas, labels, values, color) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width = canvas.clientWidth * 2, h = canvas.height = canvas.clientHeight * 2;
    ctx.clearRect(0, 0, w, h);
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var pad = (max - min) * 0.15 || 1; min -= pad; max += pad;
    var x0 = 70, x1 = w - 30, y0 = 20, y1 = h - 50;
    ctx.strokeStyle = "#dbe3ea"; ctx.fillStyle = "#5b6b7a"; ctx.font = "22px system-ui";
    ctx.textAlign = "right";
    for (var g = 0; g <= 4; g++) {
      var v = min + ((max - min) * g) / 4, y = y1 - ((v - min) / (max - min)) * (y1 - y0);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.fillText(v.toFixed(1), x0 - 10, y + 8);
    }
    ctx.textAlign = "center";
    var px = labels.map(function (_, i) { return x0 + ((x1 - x0) * i) / (labels.length - 1); });
    var py = values.map(function (v) { return y1 - ((v - min) / (max - min)) * (y1 - y0); });
    labels.forEach(function (l, i) { ctx.fillText(String(l), px[i], h - 14); });
    ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.beginPath();
    py.forEach(function (y, i) { i ? ctx.lineTo(px[i], y) : ctx.moveTo(px[i], y); });
    ctx.stroke();
    ctx.fillStyle = color;
    py.forEach(function (y, i) { ctx.beginPath(); ctx.arc(px[i], y, 8, 0, 7); ctx.fill(); });
  }
  function drawBars(canvas, labels, values, color) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width = canvas.clientWidth * 2, h = canvas.height = canvas.clientHeight * 2;
    ctx.clearRect(0, 0, w, h);
    var max = Math.max.apply(null, values) * 1.1;
    var bw = (w - 40) / labels.length;
    ctx.font = "20px system-ui"; ctx.fillStyle = "#5b6b7a"; ctx.textAlign = "center";
    labels.forEach(function (l, i) {
      var bh = ((h - 70) * values[i]) / max, x = 20 + bw * i, y = h - 40 - bh;
      ctx.fillStyle = color; ctx.fillRect(x + 8, y, bw - 16, bh);
      ctx.fillStyle = "#17202a"; ctx.fillText(values[i].toFixed(1), x + bw / 2, y - 8);
      ctx.fillStyle = "#5b6b7a"; ctx.fillText(String(l), x + bw / 2, h - 12);
    });
  }
  // Overview charts
  drawLine($("popChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.population; }), "#0e7c7b");
  drawLine($("growthChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.growth; }), "#0b2545");
  drawBars($("sectorChart"), D.sectors.slice(0, 8).map(function (s) { return s.name.split(" ")[0]; }), D.sectors.slice(0, 8).map(function (s) { return s.share; }), "#d9a441");
  drawLine($("lifeChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.life; }), "#0e7c7b");
  drawLine($("inflChart"), D.years.map(function (r) { return r.year; }), D.years.map(function (r) { return r.inflation; }), "#0b2545");
  drawBars($("ageChart"), D.ageGroups.map(function (a) { return a.group; }), D.ageGroups.map(function (a) { return a.pct; }), "#0e7c7b");
  // Year switcher on overview
  var ys = $("yearSelect");
  if (ys) {
    ys.addEventListener("change", function () {
      var row = D.years.find(function (r) { return r.year === +ys.value; });
      if (!row) return;
      ["kPop", "kGdp", "kGrowth", "kLife", "kUnemp", "kInfl"].forEach(function (id) {
        var el = $(id); if (el) el.textContent = { kPop: row.population.toFixed(1) + " jt", kGdp: "Rp " + row.gdp.toLocaleString("en-US") + " T", kGrowth: row.growth.toFixed(2) + "%", kLife: row.life.toFixed(1) + " thn", kUnemp: row.unemp.toFixed(2) + "%", kInfl: row.inflation.toFixed(2) + "%" }[id];
      });
    });
  }
  // Sortable tables
  document.querySelectorAll("table.sortable").forEach(function (table) {
    var dir = 1;
    table.querySelectorAll("th").forEach(function (th, idx) {
      th.addEventListener("click", function () {
        var tb = table.tBodies[0];
        var rows = Array.prototype.slice.call(tb.rows);
        rows.sort(function (a, b) {
          var av = a.cells[idx].textContent.trim(), bv = b.cells[idx].textContent.trim();
          var an = parseFloat(av.replace(/[^0-9.]/g, "")), bn = parseFloat(bv.replace(/[^0-9.]/g, ""));
          var cmp = !isNaN(an) && !isNaN(bn) && av !== "" ? an - bn : av.localeCompare(bv);
          return cmp * dir;
        });
        dir *= -1;
        rows.forEach(function (r) { tb.appendChild(r); });
      });
    });
  });
  // Province search
  var q = $("provSearch"), body = $("provBody");
  if (q && body) {
    q.addEventListener("input", function () {
      var needle = q.value.toLowerCase();
      Array.prototype.forEach.call(body.rows, function (r) {
        r.style.display = r.textContent.toLowerCase().indexOf(needle) === -1 ? "none" : "";
      });
      var n = $("provCount");
      if (n) n.textContent = Array.prototype.filter.call(body.rows, function (r) { return r.style.display !== "none"; }).length + " of 38 provinces shown";
    });
  }
  // Tabs on health page
  document.querySelectorAll(".tabs").forEach(function (tabs) {
    tabs.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabs.querySelectorAll("button").forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        document.querySelectorAll("[data-panel]").forEach(function (p) { p.style.display = "none"; });
        var panel = document.querySelector('[data-panel="' + btn.dataset.tab + '"]');
        if (panel) panel.style.display = "";
      });
    });
  });
})();
