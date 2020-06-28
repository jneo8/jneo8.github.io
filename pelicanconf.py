#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'jneo8'
SITENAME = "jneo8"
SITEURL = ''

PATH = 'content'

TIMEZONE = 'Asia/Taipei'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = ()

# Social widget
SOCIAL = (
        ('twitter', 'https://twitter.com/lin_jneo8'),
        ('github', 'https://github.com/jneo8'),
)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

# Plugins and extensions
MARKDOWN = {
    "extension_configs": {
        "markdown.extensions.admonition": {},
        "markdown.extensions.codehilite": {"css_class": "highlight"},
        "markdown.extensions.extra": {},
        "markdown.extensions.meta": {},
        "markdown.extensions.toc": {"permalink": " "},
    }
}

# Plugins
PLUGIN_PATHS = ["plugins"]
PLUGINS = [
    'tipue_search',
]

# Theme
THEME = 'themes/elegant'

#
# Elegant theme
# Customized settings for elegant theme

DIRECT_TEMPLATES = ["index", "tags", "categories", "archives", "search", "404"]
## Elegant Labels

# Landing Page
PROJECTS_TITLE = "Related Projects"
PROJECTS = [
    {
        "name": "mermaid",
        "url": "https://github.com/jneo8/mermaid",
        "description": "Mermaid is a tool helping user use Cobra, Viper and dig together.",
    },
]

## LANDING PAGE
LANDING_PAGE_TITLE = "This is my blog"

## DISQUS
DISQUS_FILTER = False

## Author
AUTHORS = {
    "jneo8": {
        "url": "https://twitter.com/lin_jneo8",
        "blurb": "is the creator of this blog.",
        "avatar": "/images/jneo8.jpg",
    },
}

