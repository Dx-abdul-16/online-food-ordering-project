with open('server_log.txt', 'rb') as f:
    content = f.read()
    try:
        print(content.decode('utf-16le'))
    except:
        try:
            print(content.decode('utf-8'))
        except:
            print(content)
