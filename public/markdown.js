export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);
}

function renderInline(value = "") {
  const codeSpans = [];
  let safe = escapeHtml(value).replace(/`([^`\n]+)`/g, (_, code) => {
    const index = codeSpans.push(`<code>${code}</code>`) - 1;
    return `\u0000CODE${index}\u0000`;
  });
  safe = safe
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return safe.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeSpans[Number(index)]);
}

const tableCells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
const tableDivider = (line = "") => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

export function renderMarkdown(markdown = "") {
  const lines = String(markdown).replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  const startsBlock = (index) => {
    const line = lines[index] || "";
    return /^```/.test(line.trim()) || /^#{1,4}\s+/.test(line) || /^\s*([-*+] |\d+\. )/.test(line)
      || /^>\s?/.test(line) || /^\s*---+\s*$/.test(line)
      || (line.includes("|") && tableDivider(lines[index + 1] || ""));
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }

    const fence = line.trim().match(/^```([\w+-]*)\s*$/);
    if (fence) {
      const code = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) code.push(lines[i++]);
      if (i < lines.length) i += 1;
      const language = fence[1] ? `<span class="code-language">${escapeHtml(fence[1])}</span>` : "";
      html.push(`<div class="md-code">${language}<pre><code>${escapeHtml(code.join("\n"))}</code></pre></div>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + 2);
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.includes("|") && tableDivider(lines[i + 1] || "")) {
      const headers = tableCells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) rows.push(tableCells(lines[i++]));
      html.push(`<div class="md-table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const tag = ordered ? "ol" : "ul";
      const items = [];
      const pattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
      while (i < lines.length) {
        const match = lines[i].match(pattern);
        if (!match) break;
        items.push(`<li>${renderInline(match[1])}</li>`);
        i += 1;
      }
      html.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quotes = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quotes.push(lines[i++].replace(/^>\s?/, ""));
      html.push(`<blockquote>${quotes.map(renderInline).join("<br>")}</blockquote>`);
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) { html.push("<hr>"); i += 1; continue; }

    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !startsBlock(i)) paragraph.push(lines[i++].trim());
    html.push(`<p>${paragraph.map(renderInline).join("<br>")}</p>`);
  }
  return html.join("");
}
