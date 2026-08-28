import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_valid_email(value):
    return bool(value) and bool(EMAIL_RE.match(value))


def parse_pagination(args, default_per_page=20, max_per_page=100):
    page = max(args.get("page", 1, type=int) or 1, 1)
    per_page = min(max(args.get("per_page", default_per_page, type=int) or default_per_page, 1), max_per_page)
    return page, per_page
