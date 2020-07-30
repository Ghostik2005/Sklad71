# coding: utf-8

try:
    del r1
except:
    pass

def r2(*a, **kw):
    return 'r2:', a, kw

def r3(*a, **kw):
    return 'r3:', a, kw

