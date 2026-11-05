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

# Serve with content/draft/ included (temporarily drops `draft` from ignorePatterns; restored on exit)
serve-drafts port=port:
    #!/usr/bin/env bash
    set -euo pipefail
    cp quartz.config.yaml .quartz.config.yaml.bak
    trap '[ -f .quartz.config.yaml.bak ] && mv .quartz.config.yaml.bak quartz.config.yaml' EXIT
    sed -i '/^    - draft$/d' quartz.config.yaml
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

# Create a new draft in content/draft/ with the same frontmatter as the Obsidian template (just new "My Title")
new title:
    #!/usr/bin/env bash
    set -euo pipefail
    uid="$(date +%Y%m%d%H%M)"
    file="content/draft/{{title}}-${uid}.md"
    [ -e "$file" ] && { echo "exists: $file"; exit 1; }
    cat > "$file" <<MD
    ---
    UID: ${uid}
    created: $(date +%Y-%m-%dT%H:%M:%S%:z)
    tags:
      - articles
    ---

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
