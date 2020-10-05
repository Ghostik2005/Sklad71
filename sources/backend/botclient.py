# coding: utf-8
from __future__ import absolute_import, with_statement, print_function, unicode_literals

__version__ = '20.272.2127'  # gzip_decode
#__version__ = '20.260.0040'  # binary
#__version__ = '20.136.1222'
#__version__ = '20.104.0843'
#__version__ = '20.053.0012'
#__version__ = '20.026.2002'
#__version__ = '20.022.0456'
#__version__ = '19.347.0205'

import sys
PY2 = sys.version_info[0] < 3
PY3 = sys.version_info[0] > 2
if __name__ == '__main__':
    # env PYTHONIOENCODING="UTF-8"
    if PY2:
        reload(sys); sys.setdefaultencoding('UTF-8')
    else:
        if sys.stdout.encoding != 'UTF-8':
            sys.stdout = open(sys.stdout.fileno(), mode='w', buffering=1, encoding='UTF-8')
        #if sys.stderr.encoding != 'UTF-8':
        #    sys.stderr = open(sys.stderr.fileno(), mode='w', buffering=1, encoding='UTF-8')
    sys.stderr.close()
    sys.stderr = sys.stdout
import socket
try:
    __hostname__ = sys.__hostname__
except:
    __hostname__ = socket.gethostname().lower()
    sys.__hostname__ = __hostname__
if PY2:
    import ConfigParser as configparser
    input = raw_input
    from urllib import quote_plus, unquote_plus, urlencode
    from urlparse import urlparse
    BrokenPipeError = socket.error
    ConnectionRefusedError = socket.error
    from xmlrpclib import gzip_decode, gzip_encode
else:
    import configparser
    raw_input = input
    from urllib.parse import quote_plus, unquote_plus, urlencode, urlparse
    from xmlrpc.client import gzip_decode, gzip_encode
    unicode = str

import os, time, json  #, pickle
from threading import Thread, RLock, Event
if PY2:
    from Queue import Queue, Empty
else:
    from queue import Queue, Empty

import pydoc
import threading, types, traceback
import uuid, hashlib, base64
import random

import decimal, datetime
class ExtJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        #if isinstance(obj, Binary):
        #    return {'__binary__': obj.encode()}
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        elif isinstance(obj, datetime.datetime):
            return str(obj)
        elif isinstance(obj, datetime.date):
            return str(obj)
        elif isinstance(obj, set):
            return list(obj)
        #print('obj:', obj)
        return json.JSONEncoder.default(self, obj)

try:
    from types import SimpleNamespace
except ImportError:
    class SimpleNamespace (object):
        def __init__ (self, **kwargs):
            self.__dict__.update(kwargs)
        def __repr__ (self):
            keys = sorted(self.__dict__)
            items = ("{}={!r}".format(k, self.__dict__[k]) for k in keys)
            return "{}({})".format(type(self).__name__, ", ".join(items))
        def __eq__ (self, other):
            return self.__dict__ == other.__dict__
if PY2:
    Binary = lambda data: {'__binary__': base64.b64encode(data)}
else:
    Binary = lambda data: {'__binary__': base64.b64encode(data).decode('ascii')}
_binary = lambda obj: SimpleNamespace(data=base64.b64decode(obj.pop('__binary__'))) if '__binary__' in obj else obj

class ServiceError(RuntimeError):
    pass
class MethodError(RuntimeError):
    pass

class BOTProxy(object):

    def __init__(self, name, address=None, authkey=None):
        self._botname = name
        if address is None:
            address = ('127.0.0.1', 4222)
        self._address = address
        self._conn = BOTClient(name, address, authkey=authkey)
        #self._conn.start()

    def _close(self):
        return self._conn.close()

    def __call__(self, name, sync=True, bot=False):
        if bot:
            bot_id = 'bot.%s' % urn5(name)
            #log(bot_id, name)
            return _Method(self._conn, name, sync=sync, bot_id=bot_id)
        else:
            #if name == '.http':
            #    return self._conn.http
            if name == '.notify':
                return self._conn.notify
            elif name == '.conduit':
                return self._conn.conduit
            else:
                return _Method(self._conn, name, sync=sync, bot_id=None)

    def __repr__(self):
        return (
            "<%s for %s %s>" % (self.__class__.__name__, self._botname, self._address)
        )

    __str__ = __repr__

    def __getattr__(self, name):
        return _Method(self._conn, name, sync=True)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self._close()

class _Method(object):

    def __init__(self, conn, name, sync=True, bot_id=None):
        self.__conn = conn
        self.__send = conn.send
        if bot_id:
            self.__name = None
            self.__botname = name
        else:
            self.__name = name
            self.__botname = None
        self.__sync = sync
        self.__bot_id = bot_id

    def _set_botinfo(self, bot_id, botname):
        self.__bot_id = bot_id
        self.__botname = botname

    def __getattr__(self, name):
        if self.__name:
            _m = _Method(self.__conn, "%s.%s" % (self.__name, name), sync=self.__sync, bot_id=None)
        else:
            _m = _Method(self.__conn, name, sync=self.__sync, bot_id=None)
        if self.__bot_id:
            #print(dir(_m))
            _m._set_botinfo(self.__bot_id, self.__botname)
            #_m._Method__bot_id = self.__bot_id
            #_m._Method__botname = self.__botname
        return _m

    def __call__(self, *args, **kwarg):
        if self.__name:
            return self.__send(self.__name, args, kwarg, sync=self.__sync, bot_id=self.__bot_id, botname=self.__botname)
        elif self.__botname:
            #raise RuntimeError('BOT <%s> is not callable' % self.__botname)
            name = args[0]
            #if name == '.http':
            #    return self.__conn.http
            if name == '.notify':
                return self.__conn.notify
            elif name == '.conduit':
                return self.__conn.conduit
            else:
                sync = kwarg.get('sync', self.__sync)
                _m = _Method(self.__conn, name, sync=sync, bot_id=None)
                _m._set_botinfo(self.__bot_id, self.__botname)
                #_m._Method__bot_id = self.__bot_id
                #_m._Method__botname = self.__botname
                return _m


from weakref import WeakValueDictionary
class BOTClient(object):
    def __init__(self, name, address, authkey=None):
        self._sync = WeakValueDictionary()
        self._info = {}
        self._start = None
        self.cli_id = 'cli.%s' % uuid.uuid4().hex
        self._sock = None
        self._w_lck = RLock()
        self._fg_serve_forever = False
        self._botname = name
        self.bot_id = 'bot.%s' % urn5(self._botname)
        self._address = address
        self._authkey = authkey
        self._online = Event()
        self.start()

    def start(self):
        if self._start is None:
            _t = Thread(target=self.serve_forever)
            _t.daemon = True
            _t.name += '-BOTClient'
            _t.start()
            self._start = _t
        return self._start

    def close(self):
        self._fg_serve_forever = False
        self._start = None

    def serve_forever(self):
        self.close()
        _defer = []
        defer = _defer.append
        _err_old = ''
        _fg_loop = True
        while _fg_loop:
            _fg_loop = False
            try:
                self._run(defer)
                #except (KeyboardInterrupt, SystemExit) as e:
                #    log('stop', begin='\r')
            except (ConnectionRefusedError, RuntimeError) as e:
                #log('ERROR1', 'LOOP')
                _fg_loop = True
                _err = str(e)
                if _err_old != _err:
                    _err_old = _err
                    log(_err, kind='error1')
                try:
                    time.sleep(1 + random.random())
                except:
                    _fg_loop = False
                    pass
                    #log('stop', begin='\r')
            except Exception as e:
                #log('ERROR2', 'LOOP')
                _fg_loop = self._fg_serve_forever
                #traceback.print_exc()
                _err = str(e)
                if _err_old != _err:
                    _err_old = _err
                    #log(_err, kind='error2')
                    log(None)
            finally:
                self._online.clear()
                while _defer:
                    func = _defer.pop(-1)
                    try:
                        func()
                    except:
                        #log(None)
                        pass

    def conduit(self, names):
        if names:
            if not self._online.wait(5):
                raise RuntimeError('[ %s ] connect timeout' % str(self._address))
            """
            c = 0
            while not self._fg_serve_forever:
                c += 1
                if c > 10000:
                    raise RuntimeError('[ %s ] connect timeout' % str(self._address))
                time.sleep(0.001)
            """
            sub, unsub = [], []
            r = Queue()
            id_r = id(r)
            sid = '%%s.%x' % id_r
            #sid = 'event_%s_%%s' % uuid.uuid4().hex
            for i, name in enumerate(names, 3):
                cmd = 'SUB %s %s\r\n' % (name, sid % i)
                sub.append(cmd)
                cmd = 'UNSUB %s\r\n' % (sid % i)
                unsub.append(cmd)
                #print(cmd)
            sub = ''.join(sub).encode('utf8')
            unsub = ''.join(unsub).encode('utf8')
            #print('sub:', sub)
            #print('unsub:', unsub)
            self._sync[id_r] = r
            old_sock_id = id(self._sock)
            try:
                with self._w_lck:
                    self._sock.sendall(sub)
                while self._fg_serve_forever:
                    try:
                        obj = r.get(timeout=2)
                        r.task_done()
                        yield obj
                    except Empty:
                        yield (None, None)
                    new_sock_id = id(self._sock)
                    if old_sock_id != new_sock_id:
                        log('NEW SOCK!!!')
                        old_sock_id = new_sock_id
                        with self._w_lck:
                            self._sock.sendall(unsub)
                            self._sock.sendall(sub)
            finally:
                del self._sync[id_r]
                with self._w_lck:
                    try:
                        self._sock.sendall(unsub)
                    except:
                        pass
                #print('end:', r, names)
        #print(repr(sub))
        #print(repr(unsub))

    def notify(self, subject, data=None):
        if not self._fg_serve_forever:
            return
        if data is None:
            data = ('PUB %s 0\r\n\r\n' % subject).encode('utf8')
        else:
            data = json.dumps(data, ensure_ascii=False, cls=ExtJSONEncoder).encode('utf8')
            #data = pickle.dumps(data, protocol=2)
            if len(data) > 1400:
                data = gzip_encode(data)
            data = ('PUB %s %s\r\n' % (subject, len(data))).encode('utf8') + data + b'\r\n'
        with self._w_lck:
            try:
                self._sock.sendall(data)
                return True
            except:
                pass
                #traceback.print_exc()

    """
    def http(self, head, body):
        log(self, 'http')
        print(dir(self))
        for nm in ['_address', '_authkey', '_botname', '_fg_serve_forever', '_info', '_run', '_send', '_sock', '_start', '_sync', '_w_lck', 'bot_id', 'cli_id', 'close', 'conduit', 'http', 'notify', 'send', 'serve_forever', 'start']:
            print(nm, getattr(self, nm))
        return '200 OK', [('Content-type', 'text/plain; charset=utf-8')], 'Привет Мир!'.encode()
    """
    _send_count = 0
    def send(self, name, args, kwargs, sync=True, bot_id=None, botname=None):
        #print('send:', name, args, kwargs, sync, bot_id)
        if not bot_id:
            bot_id = self.bot_id
        if '.http' == name:
            #if len(args[1]) > 1400 and b'\x1f\x8b\x08\x00' != args[1][:4]:
            #    data = b''.join([b'HTTP', json.dumps(args[0], ensure_ascii=False, separators=(',', ':')).encode('utf8'),  b'\r\n', gzip_encode(args[1])])
            #else:
            data = b''.join([b'HTTP', json.dumps(args[0], ensure_ascii=False, separators=(',', ':')).encode('utf8'),  b'\r\n', args[1]])
        else:
            data = {'method': name, 'args': args, 'kwargs': kwargs}
            data = json.dumps(data, ensure_ascii=False, cls=ExtJSONEncoder).encode('utf8')
            if len(data) > 1400:
                data = gzip_encode(data)

        if not self._online.wait(5):
            raise RuntimeError('[ %s ] connect timeout' % str(self._address))
        """
        c = 0
        while not self._fg_serve_forever:
            c += 1
            if c > 10000:
                raise RuntimeError('[ %s ] connect timeout' % str(self._address))
            time.sleep(0.001)
        """

        r = Event()
        r.ask = False
        r.result = None
        r.error = None
        i = id(r)

        #cli, sid = 'cli.%s.%x' % (uuid.uuid4().hex, i), '1.%x' % i
        #cmd = ('SUB %(cli)s %(sid)s\r\nUNSUB %(sid)s 2\r\nPUB %(bot)s %(cli)s %(l)s\r\n%%s\r\n' % {'cli': cli, 'sid': sid, 'l': len(data), 'bot': bot_id}).encode()
        #print(cmd)
        #data = cmd % data

        data = ('PUB %s %s.%x %s\r\n' % (bot_id, self.cli_id, i, len(data))).encode('utf8') + data + b'\r\n'

        self._sync[i] = r
        err = None
        with self._w_lck:
            #self._send_count += 1
            try:
                #if 0 == self._send_count % 10:
                #    self._sock.close()
                #    raise ValueError('self._send_count: %s' % self._send_count)
                self._sock.sendall(data)
            except Exception as e:
                err = e
                #self.cli_id = 'cli.%s' % uuid.uuid4().hex
                self._sock.close()
                self._online.clear()
                log(None)
        if err:
            log('[ %s ] reconnect' % str(self._address))
            if not self._online.wait(5):
                raise RuntimeError('[ %s ] connect timeout' % str(self._address))
            with self._w_lck:
                self._sock.sendall(data)

        #print('self._send_count:', self._send_count, flush=True)
        if type(sync) in (list, tuple):
            _wait1, _wait2 = sync[:2]
        else:
            _wait1, _wait2 = 5, 40
        if r.wait(_wait1):
            r.clear()
        else:
            r.error = ServiceError('Service <%s> not found' % (botname if botname else self._botname))
            #with self._w_lck:
            #    self._sock.sendall(('UNSUB %s\r\n' % sid).encode())
            if sync:
                del self._sync[i]
                raise r.error
        if sync:
            if r.wait(_wait2) != True:
                r.error = MethodError('Method <%s> timeout' % name)
                #with self._w_lck:
                #    self._sock.sendall(('UNSUB %s\r\n' % sid).encode())
            del self._sync[i]
            if r.error:
                if isinstance(r.error, (str, unicode)):
                    raise RuntimeError(r.error)
                raise r.error
            return r.result
        else:
            return r

    def _run(self, defer):
        sock = socket.create_connection(self._address, 0.5)
        self._sock = sock
        defer(sock.close)

        def w(data):
            with self._w_lck:
                #log('%s[%s] %s' % (data[:3].decode(), id(sock), id(self._sock)), 'SEND')
                sock.sendall(data)

        bot_name = self._botname
        bot_id = 'bot.%s' % urn5(bot_name)

        w(('CONNECT {"name":"%s","verbose":false,"pedantic":false}\r\nSUB %s.* 2\r\n' % (bot_name, self.cli_id)).encode('utf8'))

        #r = sock.makefile('rb', 0)
        #defer(r.close)
        self._online.set()
        #print('_run', flush=True)
        #print(dir(sock))
        self._fg_serve_forever = True
        c = 0
        #cc = 0 
        while self._fg_serve_forever:
            #cc += 1
            cmd = ''
            data = ''
            try:
                data = recvline(sock)
                cmd, data = data[:3], data[3:]
                #log(cmd, '_RUN')
            except socket.timeout:
                #log('timeout', '_RUN')
                c += 1
                #log('%s) timeout' % c, 'socket0')
                if c > 2:
                    c = 0
                    #log('pong) timeout', 'socket0')
                    w(b'PONG\r\n')
                continue
            if not cmd:
                raise RuntimeError('[ Socket ] cmd is empty')
            if not data:
                raise RuntimeError('[ Socket ] data is empty')

            #if cc > 15:
            #    raise RuntimeError('[ DEBUG ] error for test')
            #log('>%s<' % data, '<%s>' % cmd)
            if 'MSG' == cmd:
                #MSG <subject> <sid> [reply-to] <#bytes>\r\n[payload]\r\n
                data = data.split()
                #print('data:', data)
                if 3 == len(data):
                    subj, sid, reply_id, size = data[0], data[1], '', int(data[2])
                else:
                    subj, sid, reply_id, size = data[0], data[1], data[2], int(data[3])
                payload = recvall(sock, size) if size > 0 else b''
                sock.recv(1)
                sock.recv(1)
                #print(cmd, subj, sid, reply_id, repr(payload)[:48], '...', len(payload))
                if sid[:2] == '1.':
                    sid = '2'
                if sid == '2':
                    fg_http = b'HTTP' == payload[:4]
                    if fg_http:
                        pass
                    else:
                        if b'\x1f\x8b\x08\x00' == payload[:4]:
                            if PY2:
                                payload = gzip_decode(payload)
                            else:
                                payload = gzip_decode(payload, -1)
                        if payload:
                            try:
                                payload = json.loads(payload, object_hook=_binary)
                            except Exception as e:
                                payload = {'error': str(e)}
                        else:
                            pyaload = {}
                    i = int(subj.rsplit('.', 1)[-1], 16)
                    _r = self._sync.get(i)
                    #log(_r, i)
                    if _r:
                        #print('[ASK]:', _r.ask)
                        #sys.stdout.flush()
                        if not reply_id and size == 0:
                            #print('1>', _r.is_set(), _r.ask)
                            #sys.stdout.flush()
                            _r.ask = True
                            _r.set()
                        else:
                            #print('2>', _r.is_set(), _r.ask)
                            #sys.stdout.flush()
                            while _r.is_set() and _r.ask:
                                time.sleep(0.001)
                            if fg_http:
                                headers, payload = payload.split(b'\r\n', 1)
                                status, headers = json.loads(headers[4:])
                                #if b'\x1f\x8b\x08\x00' == payload[:4]:
                                #    payload = gzip_decode(payload, -1)
                                _r.result = (status, headers, payload)
                                _r.error = None
                            else:
                                _r.result = payload.pop('result', None)
                                _r.error = payload.pop('error', None)
                            _r.set()
                    #else:
                    #    print(i, payload)
                else:
                    if b'\x1f\x8b\x08\x00' == payload[:4]:
                        if PY2:
                            payload = gzip_decode(payload)
                        else:
                            payload = gzip_decode(payload, -1)
                    if payload:
                        payload = json.loads(payload, object_hook=_binary)
                        #payload = pickle.loads(payload)
                    else:
                        payload = None
                    #print(subj)
                    i = int(sid.rsplit('.', 1)[-1], 16)
                    _r = self._sync.get(i)
                    #print('_r:', _r, i)
                    #print(', '.join(str(x) for x in self._sync.keys()))
                    if _r:
                        _r.put((subj, payload))
                    #else:
                    #    print(i, payload)
            elif 'PIN' == cmd:
                w(b'PONG\r\n')
            elif 'INF' == cmd:
                self._info = json.loads(data[2:])
                #print('INFO:', self._info)
                #cid = self._info['client_id']
            #elif cmd in ('PON', '+OK', '-ER'):
            #    pass

class AttrDict(dict):
    def __init__(self, *args, **kwargs):
        super(AttrDict, self).__init__(*args, **kwargs)
        self.__dict__ = self

def recvline(s):
    data = []
    while True:
        ch2 = s.recv(2)
        if ch2:
            data.append(ch2)
            if ch2[-1:] == b'\r':
                data.append(s.recv(1))
                break
            elif ch2[-1:] == b'\n':
                break
        else:
            break
    return b''.join(data).decode()

def recvall(r, n):
    data = []
    c = 0
    while c < n:
        packet = r.recv(n - c)
        if not packet:
            break
        c += len(packet)
        data.append(packet)
    return b''.join(data)

"""
def readall(r, n):
    data = []
    c = 0
    while c < n:
        #log(c, n)
        packet = r.read(n - c)
        if not packet:
            return b''
        c += len(packet)
        data.append(packet)
    return b''.join(data)
"""

def urn1(name):
    h1 = hashlib.sha1(uuid.NAMESPACE_DNS.bytes)
    h1.update(name.encode())
    return base64.b32encode(h1.digest()).decode('utf8')
    #return 'urn:sha1:%s' % base64.b32encode(h1.digest()).decode('utf8')

def urn5(name):
    h5 = hashlib.md5(uuid.NAMESPACE_DNS.bytes)
    h5.update(name.encode())
    return base64.b16encode(h5.digest()).decode('utf8').lower()
    #return 'urn:md5:%s' % base64.b16encode(h5.digest()).decode('utf8').lower()

_ts = "%Y-%m-%d %H:%M:%S"
__appname__ = 'bot'
__profile__ = 'test'
__index__   = os.getpid()
def log(msg, kind='info', begin='', end='\n'):
    global _ts, __hostname__, __appname__, __profile__, __version__, __index__
    try:
        try: ts = time.strftime(_ts)
        except: ts = time.strftime(_ts)
        if msg is None:
            data = ''.join(
                ('%s %s %s.%s %s %s:%s %s\n' % (ts, __hostname__, __appname__,__profile__,__version__,__index__,'traceback', msg)
                if i else '%s %s %s.%s %s %s:%s\n' % (ts, __hostname__, __appname__,__profile__,__version__,__index__,msg)
                ) for i, msg in enumerate(traceback.format_exc().splitlines())
            )
        else:
            data = '%s%s %s %s.%s %s %s:%s %s%s' % (begin,ts, __hostname__, __appname__,__profile__,__version__,__index__,kind, msg,end)
        sys.stdout.write(data)
        sys.stdout.flush()
    except:
        pass
        #traceback.print_exc()
try:
    if sys.log:
        log = sys.log
except:
    pass


################################

"""
rpc = NewRpc('https://sklad71.org/apps/fdbsrv@plx-db/uri/RPC2', '3cd85bc33db44a24a891ae0c0b2d5e98', 7)
def get_addr_codes(address_id):
    sccode, sacode = '', ''
    sql = u"select sccode, sacode from app_addresscode where address_id = %s and supplier_id = %s limit 1;"
    Hels35 = 150
    RegionV = 207
    rows, e = rpc('fdb.execute', 'plx', sql, [int(address_id), RegionV])
    if not e and rows and len(rows) > 0:
        sccode, sacode = rows[0]
    return sccode.strip(), sacode.strip()
"""

if __name__ == '__main__':
    #print('STOP', __name__, __file__)
    #sys.exit(0)
    from pprint import pprint
    #"""
    name = 'uidsrv2.default'
    c = BOTProxy(name, ('127.0.0.1', 4222))
    try:
        pprint(c.system.listMethods())
    except:
        log(None)
    input('>> ')
    while True:
        t1 = time.time()
        try:
            pprint(c.system.listMethods())
            #pprint(c.ver())
            #pprint(c.hostname())
            #pprint(c.system.appinfo())
            #pprint(c.uid())
            #pprint(c.uid0())
            #pprint(c.uid1())
            #pprint(c.uid10())
            #pprint(c.uid100())
            #pprint(c.uid13())
        except KeyboardInterrupt:
            break
        except:
            log(None)
        t2 = time.time()
        print(t2 - t1)
        #input('>> ')
    sys.exit(0)
    #"""

    """
    name = 'ordbot.plx3'
    print(name)
    c = BOTProxy(name, ('127.0.0.1', 4222))
    pprint(c.system.listMethods())
    pprint(c.system.listMethods('order'))
    print(c.hostname(), c.order.ver())
    #print(c.order.save('134567.txt', 'Мой заказ!'))
    #print(c.order.push('134567.txt', None))
    #print(c.order.save('order00000-7100000000-00000000000', 'Мой заказ!'))
    #print(c.order.push('order00000-7100000000-00000000000'))
    sys.exit(0)
    #"""

    """
    for i in range(5, 6):
        name = 'fdbsrv.sklad%s' % i
        print(name)
        c = BOTProxy(name, ('127.0.0.1', 4222))
        #c = BOTProxy(name)  # , ('nats1.tgbot.ms', 4222))
        pprint(c.system.listMethods('fdb'))
        pprint(c.fdb.aliases())
        alias = 'ms/plx'

        #sql = u"select * from app_addresscode limit 3;"
        #sql = u"select sccode, sacode from app_addresscode where address_id != %s and supplier_id = %s limit 1;"

        sql0 = u"SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '%s'" % 'app_addresscode';
        sql2 = u"SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '%s'" % 'app_org';

        sql = '''SELECT table_name FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
AND table_schema IN('public', 'myschema');'''

        #rows = c.fdb.execute(alias, sql)
        #pprint(rows)

        sql = "select * from app_org where id=75 limit 3;"

        sql = '''SELECT table_name FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
AND table_schema IN('public', 'myschema');'''

        sql = u"SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '%s'" % 'app_address';
        sql = "select a.* from app_address a where a.invoice_code like '%554770%'"

        sql = '''SELECT s.code, a.org_id, c.address_id, c.sccode, c.sacode, a.invoice_code, a.title, a.short_title, a.address
FROM public.app_supplier s
JOIN public.app_addresscode c on s.id = c.supplier_id and coalesce(c.sccode, '') != '' and coalesce(c.sacode, '') != ''
JOIN public.app_address a on c.address_id = a.id and coalesce(a.invoice_code, '') != ''
ORDER BY c.id ASC'''

        sql_inv = '''SELECT s.code, a.org_id, c.address_id, c.sccode, c.sacode, a.invoice_code, a.title, a.short_title, a.address
FROM public.app_supplier s
JOIN public.app_addresscode c on s.id = c.supplier_id and coalesce(c.sccode, '') != '' and coalesce(c.sacode, '') != ''
JOIN public.app_address a on c.address_id = a.id and coalesce(a.invoice_code, '') != ''
where a.invoice_code='%s' and s.code='40277'
ORDER BY c.id ASC'''

        sql_org = "select * from app_org where inn='%s';" % '4401149171'
        sql_adr = "select * from app_address where org_id=%s;" % 588

        #sql = sql_adr  # sql1
        invoice_code='41976'
        #sql = sql_inv % invoice_code
        sql1 = u"SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '%s'" % 'app_address';
        sql = sql1

        sql_adr1 = '''select a.org_id||':'||a.id||'=:', a.address, o.fulltitle from app_address a join app_org o on a.org_id=o.id where a.invoice_code='%s';''' % invoice_code
        sql = sql_adr1

        #sql = sql2
        rows = c.fdb.execute(alias, sql) or []
        #rows.sort()
        pprint(rows)
        print(len(rows), name, alias)
        print(sql)
        c._close()
        input('>> ')
    #c._close()
    sys.exit(0)
    #"""

    """
    rpc = BOTProxy('', ('127.0.0.1', 4222))
    names = []
    names.extend('fdbsrv.sklad%s' % i for i in range(0, 5))
    #names.append('fdbsrv.plexpert')
    #names.append('fdbsrv.plx-db')
    #names.append('fdbsrv.plx-db0')
    #names.append('dbbot.plx-db0')
    #names.append('dbbot.antey')
    for name in names:
        c = rpc(name, bot=True)
        #c = BOTProxy(name, ('127.0.0.1', 4222))
        #c = BOTProxy(name)  # , ('nats1.tgbot.ms', 4222))
        pprint(c.system.listMethods())
        pprint(c.system.listMethods('fdb'))
        pprint(c.fdb.aliases())
        print(name)
        print(c.ver1())
        input('>> ')
    rpc._close()
    #c._close()
    sys.exit(0)
    #"""


    #'''
    c = BOTProxy('fdbsrv.plx-db', ('127.0.0.1', 4222))
    #c = BOTProxy('fdbsrv.sklad4', ('127.0.0.1', 4222))
    #c = BOTProxy('fdbsrv.sklad1', ('127.0.0.1', 4222))
    #c = BOTProxy('fdbsrv.host-ms71', ('127.0.0.1', 4222))
    #alias = 'ya/snopikova_plx'
    #alias = 'ya/paracelsplus_plx'
    sql = """SELECT t1.FG_STATE, t1.id_sklad, t1.dt_in, t1.sp_count, t3.name, t1.stitle,
                t1.title, t1.vendor, t1.sp_title, t1.sp_vendor, t1.sp_mnn, t1.price, t1.acode, t1.scode, t1.id_spr, t1.id_user t FROM PLX_ORDERS_BODY_L t1
                --inner join SKLAD_SPR_USERS t3 on (t3.id = t1.id_user)
                left join SKLAD_SPR_USERS t3 on (t3.id = t1.id_user)
                where ((t1.id_spr = 116584) or (t1.id_spr = 109768) or (t1.id_spr = 106935) or (t1.id_spr = 116050) or (t1.id_spr = 98081) or (t1.id_spr = 95838) or (t1.id_spr = 97230) or (t1.id_spr = 100129) or (t1.id_spr = 115784) or (t1.id_spr = 117710) or (t1.id_spr = 63450) or (t1.id_spr = 97230) or (t1.id_spr = 26150) or (t1.id_spr = 26151) or (t1.id_spr = 45327) or (t1.id_spr = 137361) or (t1.id_spr = 2116) or (t1.id_spr = 2116) or (t1.id_spr = 2116) or (t1.id_spr = 2116) or (t1.id_spr = 90185) or (t1.id_spr = 90282) or (t1.id_spr = 21413) or (t1.id_spr = 21413) or (t1.id_spr = 21413) or (t1.id_spr = 26155) or (t1.id_spr = 29671) or (t1.id_spr = 21413) or (t1.id_spr = 73243) or (t1.id_spr = 21413) or (t1.id_spr = 83315) or (t1.id_spr = 83324) or (t1.id_spr = 83315) or (t1.id_spr = 73243) or (t1.id_spr = 83324) or (t1.id_spr = 118651) or (t1.id_spr = 21413) or (t1.id_spr = 121294) or (t1.id_spr = 83315) or (t1.id_spr = 121294) or (t1.id_spr = 133276) or (t1.id_spr = 83315) or (t1.id_spr = 26157) or (t1.id_spr = 83324) or (t1.id_spr = 73243) or (t1.id_spr = 62176) or (t1.id_spr = 115013) or (t1.id_spr = 21363) or (t1.id_spr = 111169) or (t1.id_spr = 543) or (t1.id_spr = 21363) or (t1.id_spr = 112143) or (t1.id_spr = 29250) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 23165) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 23165) or (t1.id_spr = 543) or (t1.id_spr = 36473) or (t1.id_spr = 23164) or (t1.id_spr = 47768) or (t1.id_spr = 23166) or (t1.id_spr = 47771) or (t1.id_spr = 543) or (t1.id_spr = 543) or (t1.id_spr = 29250) or (t1.id_spr = 23166) or (t1.id_spr = 29250) or (t1.id_spr = 27509) or (t1.id_spr = 26180) or (t1.id_spr = 23166) or (t1.id_spr = 47770) or (t1.id_spr = 23166) or (t1.id_spr = 23165) or (t1.id_spr = 38694) or (t1.id_spr = 23166) or (t1.id_spr = 87859) or (t1.id_spr = 543) or (t1.id_spr = 23165) or (t1.id_spr = 27510) or (t1.id_spr = 120531) or (t1.id_spr = 2115) or (t1.id_spr = 21434) or (t1.id_spr = 5032) or (t1.id_spr = 103659) or (t1.id_spr = 36162) or (t1.id_spr = 36162) or (t1.id_spr = 36162) or (t1.id_spr = 36162) or (t1.id_spr = 103659) or (t1.id_spr = 103659) or (t1.acode = '018411_1' and t1.scode = '40267') or (t1.acode = '113558185' and t1.scode = '20557') or (t1.acode = '003010_1' and t1.scode = '40267')) and t1.fg_state = 6 and t1.deleted = 0 and t1.fg_individ=0 and (t1.id_sklad = 3 and t1.dt_in >= current_timestamp - interval '0 days') order by t1.dt_in desc
"""
    alias = "plx"
    sql = """select sccode, sacode from app_addresscode where address_id != 0 and supplier_id = 207"""
    rows = c.fdb.execute(alias, sql + ' limit 50;') or []
    pprint(rows)

    pprint(c.fdb.aliases())
    exit()
    #c = BOTProxy('fdbsrv.sklad4', ('78.155.207.145', 4222))  # tgbot-site1
    #c = BOTProxy('fdbsrv.sklad4', ('78.155.219.217', 4222))  # oasis-site1
    #c = BOTProxy('fdbsrv.sklad1', ('127.0.0.1', 4222))  # , ('nats1.tgbot.ms', 4222))
    #c = BOTProxy('fdbsrv.sklad1')  # , ('nats1.tgbot.ms', 4222))
    #c = BOTProxy('fdbsrv.andy-mbp')
    #c = BOTProxy('fdbsrv.andy-mbp', ('nats1.tgbot.ms', 4222))
    #t1 = time.time()
    #print(c)
    #print(c.system.listMethods())
    #print(c.system.listMethods('fdb'))
    #print(c.fdb.ver())
    #sys.exit(0)
    #rows = []
    #for k, v in c.fdb.aliases(True).items():
    #    if v != 'postgres':
    #        continue
    #    rows.append(k)
    #    #print(k)
    #rows.sort()
    #for k in rows:
    #    print(k)
    #sys.stdout.flush()
    #sys.exit(0)

    #sql = """select g.cd_code from groups g join classifier c on g.cd_group = c.cd_group and c.idx_group = 5;"""
    #sql = """SELECT datname, COUNT(*) AS c from pg_stat_activity GROUP BY datname ORDER BY c DESC, datname ASC;"""
    sql0 = u"SELECT pg_size_pretty(pg_database_size(current_database()))"
    sql00 = u'select * from SKLAD_SPR_TOVARY'
    #sql = u"SELECT pg_database_size(current_database());"
    #sql = u"SELECT relname, relpages FROM pg_class ORDER BY relpages DESC;"
    #sql = u"select * from app_address limit 3;"
    #sql = u"select * from auth_user limit 3;"
    #sql = u"select * from app_order limit 3;"
    #sql = u"SELECT datname,usename,client_addr,client_port FROM pg_stat_activity;"
    #sql = u"SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '%s'" % 'app_order';
    #sql = u"SELECT column_name, column_default, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '%s'" % 'auth_user';
    #sql = u"select * from app_addresscode where address_id = 1307 and supplier_id = 150;"
    sql = u"""SELECT table_name FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
AND table_schema IN('public', 'myschema');"""
    sql1 = "select * from sklad_spr_users"
    sql2 = "select * from bo_user"
    sql3 = "select * from plx_search_str"
    sql4 = "select * from sklad_sklad"
    sql5 = "select * from plx_defecture_oreder"
    sql6 = "select * from plx_orders_body"
    #sql += ' limit 50;'
    #alias = 'ya/test_plx'
    #alias = 'ya/ivanova_plx'
    #alias = 'ya/davidov_plx'
    #alias = 'ya/paracelsplus_plx'
    #alias = 'ms/antey_plx'
    alias = 'ms/test_plx'
    fg = True
    while fg:
        for i, sql in enumerate((sql1, sql2, sql3, sql4, sql5, sql6), 1):
            try:
                t1 = time.time()
                rows = c.fdb.execute(alias, sql + ' limit 50;') or []
                t2 = time.time()
                pprint(rows)
                #for row in rows:
                #    print(row)
                #t2 = time.time()
                print(len(rows), round(t2-t1, 3))
            except:
                log(None)
            print('sql%s' % i, alias, c)
            if input('>> ').strip():
                fg = False
                break
    sys.exit(0)
    #'''

    #c = BOTProxy('price-bot.test')
    #c = BOTProxy('price-bot.test', ('nats2.tgbot.ms', 4222))
    c = BOTProxy('price-bot.test', ('127.0.0.1', 4222))
    print(c)
    while True:
        print(c.time.time())
        break
        input('>> ')

    #print(c('time').localtime())
    #print(c('system.listMethods')('time'))
    #print(c('.notify')('SUBJ.1'))
    #print(c.system.listMethods1())
    """
    print(c.system.listMethods())
    print(c.system.listMethods('time'))
    print(c.time.strftime('%Y-%m-%d %H:%M:%S'))
    try:
        t1 = c.time.localtime()
    except:
        traceback.print_exc()
    t2 = c.time.gmtime()
    print(t1)
    print(t2)
    print(round((time.mktime(t1) - time.mktime(t2)) / 3600, 0))
    #"""
    #"""
    m = c('price-bot.test2', bot=True)
    #print(m)
    #print(dir(m))
    #print(m._Method__bot_id)
    #print(m._Method__botname)
    #print(m._Method__name)
    #print(m(123))
    print('-'*16)
    for i, (eventname, obj) in enumerate(c('.conduit')(['SUBJ.>',])):
        if eventname is None and obj is None:
            continue
        print(i, eventname, obj)
        if i > 1:
            time.sleep(1)
            break
    #c('.conduit')('event1', 'event2', 'event3')
    #print('-'*16)
    #c('.conduit')('event1', 'event2', 'event3')
    #print('-'*16)
    #c('.conduit')()
    print('='*16)
    #print(m.method1())
    #print(m.method1.method2())
    #print(m.system.listMethods('time'))
    #print(m('system.listMethods')('time'))
    print(m('.notify')('SUBJ.1'))
    #bot_id = 'debug.%s' % urn5(name)
    for i, (eventname, obj) in enumerate(m('.conduit')(['SUBJ.>',])):
        if eventname is None and obj is None:
            continue
        print('m:', eventname, obj)
        if i > 1:
            time.sleep(1)
            break
    #"""
