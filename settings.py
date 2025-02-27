import json


def db_conn(pos, name):
    json_content = open("connections/settings.json", "r").read()
    a_list = json.loads(json_content)
    conn = a_list[pos][name]

    return conn
