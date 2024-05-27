import contextlib

from django.db import connections


@contextlib.contextmanager
def old_db_cursor():
    connection = connections["old"]
    cursor = connection.cursor()
    try:
        yield cursor
    finally:
        cursor.close()


def dictfetchall(cursor):
    """
    Return all rows from a cursor as a dict.
    Assume the column names are unique.
    """
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def paginated_query(
    query,
    *args,
    itersize: int = 2000,
    only_columns: list = None,
    flat: bool = False,
    **kwargs
):
    """
    Performs chunked SELECT query against the old database
    """

    with old_db_cursor() as cursor:
        cursor.execute(query, *args, **kwargs)
        columns = [col[0] for col in cursor.description]

        while True:
            rows = cursor.fetchmany(itersize)

            if len(rows) > 0:
                for row in rows:
                    row = dict(zip(columns, row))

                    # Filter out columns not used
                    if only_columns:
                        row = {k: v for k, v in row.items() if k in only_columns}

                    # Return just a value if flat == True
                    if flat:
                        yield next(iter(row.values()))
                    else:
                        yield row
            else:
                break


def one2one_query(query, *args, **kwargs):
    """
    Performs One2One query
    """

    with old_db_cursor() as cursor:
        cursor.execute(query, *args, **kwargs)
        data = dictfetchall(cursor)

        if len(data) == 0:
            return
        if len(data) > 1:
            raise ValueError("More than one record found")

        return data[0]
