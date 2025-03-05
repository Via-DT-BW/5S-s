from datetime import datetime
import re


def format_datetime(dt):
    """Helper function to format datetime as DD/MM/YYYY HH:MM"""
    return datetime.strftime(dt, "%d/%m/%Y %H:%M") if dt else None


def is_email_valid(email):
    """Function that validates an email"""
    regex = re.compile(
        r"([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+"
    )
    if re.fullmatch(regex, email):
        return True
    else:
        return False
