# coding: utf-8

from __future__ import absolute_import, with_statement, print_function, unicode_literals

__version__ = '00.000.0001'

import sys, os, time, json, traceback, zipfile
from pprint import pprint
import botserver as bs

_assets = None
def _http(self, head, body):
    global _assets
    t1 = time.time()
    try:
        uri, args = head[''][1]
        method = uri.rsplit('/', 1)[-1]
        if '/' == uri:
            response = '%s %s %s.%s %s %s:%s/%s' % (time.strftime(_ts), sys.__hostname__, sys.__appname__,sys.__profile__, sys.__version__, sys.__index__,self.request_number,self.request_count)
            response = response.encode('utf-8')
            #res_head = b"HTTP/1.0 200 OK\r\nContent-Type: text/event-stream; charset=utf-8\r\nCache-Control: no-cache\r\nAccess-Control-Allow-Origin:*\r\n\r\n"
            return '200 OK', [
                ("Content-Type", "text/plain; charset=utf-8"),
                ("Cache-Control", "no-cache"),
                ("Access-Control-Allow-Origin", "*"),
                ("Content-Length", str(len(response)))
            ], response

        status = '200 OK'

        if uri == '/ui':
            uri = 'ui/'
            return '303 OK', [('Location', uri),], b''

        if uri[:4] == '/ui/' and uri[:8] != '/ui/RPC2' :
            uri = 'index.html' if uri == '/ui/' else uri[4:]
            headers = []
            if sys.fg_zip:
                _gz = False
                _file = 'assets/%s' % uri

                with zipfile.ZipFile(sys.apppath, "r") as zf:
                    if _assets is None:
                        _assets = set(filter(lambda x: x and x.startswith("assets") and x[-1] != '/', zf.namelist()))
                    zi = None
                    if _file in _assets:
                        zi = zf.getinfo(_file)
                    elif _file + '.gz' in _assets:
                        _gz = True
                        zi = zf.getinfo(_file + '.gz')
                        headers.append(('Content-Encoding', 'gzip'))
                    else:
                        return '404 Not Found', [], b''
                    if hasattr(zi, "filename"):
                        pass
                    else:
                        return '404 Not Found', [], b''
                    with zf.open(zi) as f:
                        body = f.read()
            else:
                _file = './assets/%s' % uri
                with open(_file, 'rb') as f:
                    body = f.read()
            headers.append(('Content-Type', guess_type(_file)))
            headers.append(('Content-Length', str(len(body))))
            return status, headers, body


        if 'post' == head[''][0]:
            body = json.loads(body)
            r = _func(self, body['method'], body.get('params', []), body.get('kwargs', {}))
        else:
            _a, _kw = [], {}
            if args:
                for a in args.split('&'):
                    a = a.split('=', 1)
                    if len(a) > 1:
                        _kw[a[0]] = a[1]
                    else:
                        _a.append(a[0])
            r = _func(self, method, _a, _kw)

        r = json.dumps({'result': r}, ensure_ascii=False, cls=bs.ExtJSONEncoder).encode('utf8')
        headers = [('Content-Type', 'application/json; charset=utf-8'),]
        return status, headers, r
    except Exception as e:
        log(None)
        r = json.dumps({'error': traceback.format_exc()}, ensure_ascii=False, cls=bs.ExtJSONEncoder).encode('utf8')
        headers = [('Content-Type', 'application/json; charset=utf-8'),]
        return status, headers, r
    finally:
        pass

def _func(self, func_name, args, kwargs):
    _func_name = func_name
    func = None
    if func_name in self._functions:
        func = self._functions[func_name]
    else:
        for fn in func_name.split('.'):
            try:
                func = getattr(func, fn) if func else self._functions[fn]
            except:
                func = None
                break
    if func:
        if callable(func):
            r = func(*args, **kwargs)
        else:
            r = func
        return r
    raise RuntimeError('%s not found' % _func_name)

def guess_type(path):
    global extensions_map
    base, ext = posixpath.splitext(path)
    if ext in extensions_map:
        return extensions_map[ext]
    ext = ext.lower()
    if ext in extensions_map:
        return extensions_map[ext]
    else:
        return extensions_map['']

import mimetypes
import posixpath
if not mimetypes.inited:
    mimetypes.init() # try to read system mime.types
extensions_map = mimetypes.types_map.copy()
extensions_map.update({
    '': 'application/octet-stream', # Default
    '.py': 'text/plain',
    '.c': 'text/plain',
    '.h': 'text/plain',
    })


_ts = "%Y-%m-%d %H:%M:%S"
try:
    log = sys.log
except:
    log = lambda *a, **kw: print('test >>', a[0])


def test():
    log('Hi!')

if '__main__' == __name__:
    test()
