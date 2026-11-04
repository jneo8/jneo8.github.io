# Quartz 5 site helpers. Run `just` to list recipes.

set shell := ["bash", "-euo", "pipefail", "-c"]

port := "8080"

# List available recipes
default:
    @just --list --unsorted

# First-time setup on a fresh clone: install npm deps and Quartz plugins
setup:
    npm ci
    npx quartz plugin install --from-config

# Build and serve locally with hot reload (http://localhost:{{port}})
serve port=port:
    npx quartz build --serve --port {{port}}

# Build the static site into public/
build:
    npx quartz build

# Remove build output and plugin cache
clean:
    rm -rf public .quartz-cache

# Re-install plugins listed in quartz.config.yaml (after editing the plugin list)
plugins:
    npx quartz plugin install --from-config

# Update installed plugins to their latest versions
plugins-update:
    npx quartz plugin install --latest

# Pull the latest Quartz from upstream (jackyzha0/quartz, branch v5)
upgrade:
    npx quartz upgrade

# Create a new article from the Obsidian template (just new "My Title")
new title:
    #!/usr/bin/env bash
    set -euo pipefail
    uid="$(date +%Y%m%d%H%M)"
    file="content/publish/{{title}}-${uid}.md"
    [ -e "$file" ] && { echo "exists: $file"; exit 1; }
    cat > "$file" <<MD
    ---
    UID: ${uid}
    created: $(date +%Y-%m-%dT%H:%M:00%:z)
    title: "{{title}}"
    draft: true
    tags:
    - articles
    ---

    # {{title}}

    # Summary

    # Notes

    ---
    # References
    MD
    echo "created $file"

# Type-check and verify formatting
check:
    npm run check

# Format the repo with prettier
format:
    npm run format
