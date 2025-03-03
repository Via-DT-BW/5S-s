from datetime import datetime


def format_datetime(dt):
    """Helper function to format datetime as DD/MM/YYYY HH:MM"""
    return datetime.strftime(dt, "%d/%m/%Y %H:%M") if dt else None
