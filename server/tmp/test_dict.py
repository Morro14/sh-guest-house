dict_a = {"a": "1", "b": "2"}
dict_b = {key: value for key, value in dict_a.items() if key != "b"}
# print(dict_a)
for key in dict_a:
    print(key)
