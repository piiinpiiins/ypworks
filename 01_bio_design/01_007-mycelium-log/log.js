/*
 * Fetches each date folder's content.md, converts it to the log entry markup,
 * then wires up date-rail navigation (via #YYYY-MM-DD hash) and hashtag
 * filtering. Editing a content.md file is enough — no HTML to touch.
 *
 * Supported content.md shapes (first "# ..." line is skipped, the rest is
 * split into blank-line-separated blocks):
 *   ![alt](file.jpg)              -> <img class="detail-media">
 *   [text](url)                   -> <p><a>...</a></p>
 *   - label：value                -> <p><strong>label：</strong>value</p>
 *   - self-founded                -> <p>self-founded</p>
 *   - tags: a, b                  -> hashtag buttons + data-tags (not printed as a bullet)
 *   any other paragraph           -> <p>...</p>
 *
 * Requires the page to be served over http(s) (fetch of local files is
 * blocked under file://) — e.g. `python3 -m http.server`, or once deployed
 * on GitHub Pages.
 */
(function () {
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function folderToId(folder) {
    return folder.slice(0, 4) + "-" + folder.slice(4, 6) + "-" + folder.slice(6, 8);
  }

  function parseEntry(md, folder) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    if (lines[0] && /^#\s/.test(lines[0].trim())) lines = lines.slice(1);
    var text = lines.join("\n").trim();
    var blocks = text.split(/\n{2,}/).map(function (b) { return b.trim(); }).filter(Boolean);

    var bodyHtml = "";
    var tags = [];

    blocks.forEach(function (block) {
      var imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      var linkMatch = block.match(/^\[([^\]]*)\]\(([^)]+)\)$/);

      if (imgMatch) {
        bodyHtml += '<img src="' + folder + "/" + imgMatch[2] + '" alt="' + escapeHtml(imgMatch[1]) + '" class="detail-media">';
        return;
      }
      if (linkMatch) {
        bodyHtml += '<p><a href="' + escapeHtml(linkMatch[2]) + '" target="_blank">' + escapeHtml(linkMatch[1]) + "</a></p>";
        return;
      }

      var blockLines = block.split("\n").map(function (l) { return l.trim(); });
      var isList = blockLines.every(function (l) { return /^-\s+/.test(l); });

      if (isList) {
        blockLines.forEach(function (line) {
          var item = line.replace(/^-\s+/, "");
          var tagsMatch = item.match(/^tags?\s*[:：]\s*(.+)$/i);
          if (tagsMatch) {
            tags = tagsMatch[1].split(/[,，]\s*/).map(function (t) { return t.trim(); }).filter(Boolean);
            return;
          }
          if (/^self-founded$/i.test(item)) {
            bodyHtml += "<p>self-founded</p>";
            return;
          }
          var kv = item.match(/^([^：:]+)[：:]\s*(.*)$/);
          if (kv) {
            bodyHtml += "<p><strong>" + escapeHtml(kv[1]) + "：</strong>" + escapeHtml(kv[2]) + "</p>";
          } else {
            bodyHtml += "<p>" + escapeHtml(item) + "</p>";
          }
        });
      } else {
        bodyHtml += "<p>" + escapeHtml(block) + "</p>";
      }
    });

    return { bodyHtml: bodyHtml, tags: tags };
  }

  var notesEl = document.querySelector(".log-notes");
  var datesEl = document.querySelector(".log-dates");
  if (!notesEl || !datesEl) return;

  var folders = (notesEl.dataset.entries || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  if (!folders.length) return;

  Promise.all(folders.map(function (folder) {
    return fetch(folder + "/content.md")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (md) { return { folder: folder, id: folderToId(folder), parsed: parseEntry(md, folder) }; })
      .catch(function (err) {
        return { folder: folder, id: folderToId(folder), parsed: { bodyHtml: "<p>（載入失敗：" + folder + "/content.md — " + escapeHtml(err.message) + "）</p>", tags: [] } };
      });
  })).then(function (results) {
    var dateLinksHtml = "";
    var notesHtml = "";

    results.forEach(function (r) {
      dateLinksHtml += '<a href="#' + r.id + '" class="log-date-link" data-date="' + r.id + '">' + r.id + "</a>";

      var tagsHtml = "";
      if (r.parsed.tags.length) {
        tagsHtml = '<p class="log-tags">' + r.parsed.tags.map(function (t) {
          return '<button type="button" class="log-tag" data-tag="' + escapeHtml(t) + '">#' + escapeHtml(t) + "</button>";
        }).join("") + "</p>";
      }

      notesHtml += '<article id="' + r.id + '" class="log-entry stack-sm" data-tags="' + escapeHtml(r.parsed.tags.join(",")) + '">'
        + "<h2>" + r.id + "</h2>"
        + r.parsed.bodyHtml
        + tagsHtml
        + "</article>";
    });

    datesEl.insertAdjacentHTML("beforeend", dateLinksHtml);
    notesEl.innerHTML = notesHtml;

    initInteraction();
  });

  function initInteraction() {
    var entries = Array.prototype.slice.call(document.querySelectorAll(".log-entry"));
    var dateLinks = Array.prototype.slice.call(document.querySelectorAll(".log-date-link"));
    var tagButtons = Array.prototype.slice.call(document.querySelectorAll(".log-tag"));
    var filterBar = document.querySelector(".log-filter-bar");
    var filterTagLabel = document.querySelector(".log-filter-tag");
    var filterClearBtn = document.querySelector(".log-filter-clear");
    if (!entries.length) return;

    var activeTag = null;

    function entryTags(entry) {
      return (entry.dataset.tags || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
    }

    function matchesFilter(entry) {
      return !activeTag || entryTags(entry).indexOf(activeTag) !== -1;
    }

    function firstMatch() {
      var matches = entries.filter(matchesFilter);
      return matches[0] || entries[0];
    }

    // Show/hide date links per the active tag filter, and jump off a
    // now-hidden entry onto the first still-visible one.
    function applyFilter() {
      dateLinks.forEach(function (a) {
        var entry = document.getElementById(a.dataset.date);
        a.hidden = !(entry && matchesFilter(entry));
      });

      tagButtons.forEach(function (btn) {
        btn.classList.toggle("is-active", !!activeTag && btn.dataset.tag === activeTag);
      });

      if (filterBar) filterBar.hidden = !activeTag;
      if (filterTagLabel && activeTag) filterTagLabel.textContent = "#" + activeTag;

      var current = entries.filter(function (el) { return !el.hidden; })[0];
      if (activeTag && current && !matchesFilter(current)) {
        location.hash = "#" + firstMatch().id;
      }
    }

    // Show exactly the entry matching the URL hash (or the filtered default),
    // and mark its date link active. Falls back gracefully with no JS at all.
    function activate(id) {
      var found = entries.some(function (el) { return el.id === id; });
      if (!found) id = firstMatch().id;
      entries.forEach(function (el) { el.hidden = el.id !== id; });
      dateLinks.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
      });
    }

    function sync() {
      var id = decodeURIComponent(location.hash.replace("#", "")) || firstMatch().id;
      activate(id);
    }

    tagButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeTag = activeTag === btn.dataset.tag ? null : btn.dataset.tag;
        applyFilter();
        sync();
      });
    });

    if (filterClearBtn) {
      filterClearBtn.addEventListener("click", function () {
        activeTag = null;
        applyFilter();
        sync();
      });
    }

    window.addEventListener("hashchange", sync);
    applyFilter();
    sync();
  }
})();
