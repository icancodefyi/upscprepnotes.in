#!/bin/bash
source $HOME/.local/bin/env

CONTENT_DIR="$(dirname "$0")"
TEMPLATE="$CONTENT_DIR/template.html"
OUTPUT_DIR="$CONTENT_DIR/output"
SCRIPT_DIR="$CONTENT_DIR"

mkdir -p "$OUTPUT_DIR"

for html_file in "$CONTENT_DIR"/guide-*.html; do
  [ -f "$html_file" ] || continue
  filename=$(basename "$html_file")
  base="${filename%.html}"
  pdf_file="$OUTPUT_DIR/$base.pdf"

  echo "Generating: $base.pdf"

  python3 "$CONTENT_DIR/render_pdf.py" "$TEMPLATE" "$html_file" "$pdf_file" 2>&1

  if [ -f "$pdf_file" ]; then
    echo "  ✓ Done ($(du -h "$pdf_file" | cut -f1))"
  else
    echo "  ✗ Failed"
  fi
done

echo ""
echo "All PDFs generated in: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"
