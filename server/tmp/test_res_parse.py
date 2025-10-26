def parse_resolution(res_str):
        res = res_str.split('x')
        res = [int(v) for v in res]
        return res

res = parse_resolution('600x400')
print(res)