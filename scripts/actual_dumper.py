
import mysql.connector
import datetime

try:
    print("Connecting...")
    conn = mysql.connector.connect(
        host='caboose.proxy.rlwy.net',
        user='root',
        password='CAUtybWeBlZZbEyjgbNhllfQqyUfjASN',
        database='railway',
        port=47013
    )
    print("Connected.")
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SHOW TABLES')
    tables = [list(t.values())[0] for t in cursor.fetchall()]

    with open(r'd:\online-food-ordering\database.sql', 'w', encoding='utf-8') as f:
        f.write('-- FoodExpress Full Database Backup WITH DATA\n')
        f.write('SET FOREIGN_KEY_CHECKS=0;\n\n')
        for table in tables:
            print("Dumping table: " + table)
            f.write(f'DROP TABLE IF EXISTS `{table}`;\n')
            cursor.execute(f'SHOW CREATE TABLE `{table}`')
            create_stmt = cursor.fetchone()['Create Table']
            f.write(create_stmt + ';\n\n')
            
            cursor.execute(f'SELECT * FROM `{table}`')
            rows = cursor.fetchall()
            if rows:
                columns = list(rows[0].keys())
                cols_str = ', '.join([f'`{col}`' for col in columns])
                chunk_size = 100
                for i in range(0, len(rows), chunk_size):
                    chunk = rows[i:i + chunk_size]
                    insert_stmt = f'INSERT INTO `{table}` ({cols_str}) VALUES \n'
                    values_list = []
                    for row in chunk:
                        row_vals = []
                        for col in columns:
                            val = row[col]
                            if val is None: row_vals.append('NULL')
                            elif isinstance(val, (int, float)): row_vals.append(str(val))
                            elif isinstance(val, datetime.datetime): row_vals.append(f"'{val.strftime('%Y-%m-%d %H:%M:%S')}'")
                            elif isinstance(val, datetime.date): row_vals.append(f"'{val.strftime('%Y-%m-%d')}'")
                            else:
                                v_str = str(val).replace('\\', '\\\\').replace("'", "''").replace('\n', '\\n').replace('\r', '\\r')
                                row_vals.append(f"'{v_str}'")
                        values_list.append(f"({', '.join(row_vals)})")
                    insert_stmt += ',\n'.join(values_list) + ';\n'
                    f.write(insert_stmt)
                f.write('\n')
        f.write('SET FOREIGN_KEY_CHECKS=1;\n')
    print("DONE YAY")
except Exception as e:
    print(e)
