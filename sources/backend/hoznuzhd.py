# coding: utf-8
from __future__ import absolute_import, with_statement, print_function, unicode_literals

__version__ = '<version>'

import sys, os
try:
    sys.conf
except:
    sys.conf = {}
PY2 = sys.version_info[0] < 3
PY3 = sys.version_info[0] > 2

try:
    sys.fg_zip
    sys.apppath
    fg_init = False
except:
    os.environ.putenv('PYTHONIOENCODING', 'UTF-8')
    #approot = '%s:' % sys.executable[0] if '/' != sys.executable[0] else ''
    apppath = os.path.abspath(__file__)
    _dir = os.path.dirname(apppath)
    sys.fg_zip = os.path.isfile(_dir) and _dir[-4:].lower() == '.zip'
    if sys.fg_zip:
        apppath = _dir
    sys.apppath = apppath
    del _dir
    fg_init = True

if __name__ == '__main__' or fg_init:
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
    from Queue import Queue, Empty
else:
    import configparser
    raw_input = input
    from urllib.parse import quote_plus, unquote_plus, urlencode, urlparse
    from xmlrpc.client import gzip_decode, gzip_encode
    unicode = str
    from queue import Queue, Empty

import threading, types
from threading import Thread, RLock, Event
import subprocess as sp
import multiprocessing as mp
from multiprocessing import dummy as tp
import signal

import time, traceback
import random
import json
import base64
from pprint import pprint

"""
import tempfile
sys.TEMP_DIR = tempfile.gettempdir()
sys.DATA_TEMP_DIR = None
sys.DATA_LOCAL_DIR = None
sys.DATA_SHARED_DIR = None
"""

try:
    import requests
except ImportError:
    print('install module (probably you need the rights from root):')
    print(sys.executable + ' -m pip install requests -U')
    os._exit(0)
requests.packages.urllib3.disable_warnings()
requests.adapters.DEFAULT_RETRIES = 2

try:
    import setproctitle
    sys.setproctitle = setproctitle.setproctitle
except:
    sys.setproctitle = lambda *a, **kw: None

import toml
def main():
    global __hostname__, __appname__,__profile__, __version__, __index__
    sys.__appname__,sys.__profile__, sys.__version__, sys.__index__ = __appname__,__profile__, __version__, __index__
    if 'darwin' == sys.platform:
        os.environ.putenv('OBJC_DISABLE_INITIALIZE_FORK_SAFETY', 'YES')

    import json
    """
    for k in tuple(os.environ.keys()):
        if k.isdigit():
            v = os.environ.pop(k)
            if v[0] == '{':
                sys.conf.update(json.loads(v))
            else:
                k, v = v.split('=', 1)
                sys.conf[k] = json.loads(v) if v[0] == '{' else  v
        elif k.startswith('a.'):
            k, v = k[2:], os.environ.pop(k)
            sys.conf[k] = json.loads(v) if v[0] == '{' else  v
    """
    for v in sys.argv[1:]:
        if v[0] == '{':
            sys.conf.update(json.loads(v))
        else:
            kv = v.split('=', 1)
            if len(kv) > 1:
                k, v = kv[:2]
            else:
                k, v = kv[0], ''
            k = k.lower()
            sys.conf[k] = json.loads(v) if v and v[0] in ('{', '[') else  v
    #pprint(sys.conf)

    _profile = sys.conf.get('profile', '')
    confpath = ''
    if _profile:
        __profile__ = os.path.splitext(os.path.basename(_profile))[0]
        if os.path.isfile(_profile):
            confpath = _profile
    else:
        s0 = sys.argv[0].rsplit(os.sep, 1)[-1].rsplit('.', 1)[0]
        #s0 = __file__.rsplit('.', 1)[0]
        s1 = s0.split('.', 1)[-1]
        if s1 != s0:
            __profile__ = s1
    sys.__profile__ = __profile__
    if not confpath:
        for _profile in ('%s.%s.toml' % (__appname__, __profile__), 'local/%s.%s.toml' % (__appname__, __profile__), '%s.toml' % __profile__, 'local/%s.toml' % __profile__):
            if os.path.isfile(_profile):
                confpath = _profile
                break
    pool = []
    workers = None
    worker_id =-1
    try:
        is_worker = sys.argv[1].startswith('worker=')
    except:
        is_worker = False
    if is_worker:
        sys.setproctitle('%s.%s: worker load profile' % (__appname__, __profile__))
    else:
        sys.setproctitle('%s.%s: leader load profile' % (__appname__, __profile__))
    try:
        workers = sys.conf.get('workers')
        try:
            sys.argv.remove('workers=%s' % workers)
        except:
            pass
        if confpath:
            #log(confpath, 'LOAD')
            with open(confpath, 'rt') as f:
                _conf = toml.load(f)
                _conf.update(sys.conf)
                sys.conf = _conf
                del _conf
            #pprint(sys.conf)
            if is_worker:
                try:
                    sys.conf.pop('workers')
                except KeyError:
                    pass
            else:
                workers = sys.conf.get('workers')
        workers = int(workers) if workers else 1
        #log(sys.conf, 'WORKERS[%s]' % workers)

        if workers > 1:
            nm = '%s.%s' % (__appname__, __profile__)
            argv = sys.argv[1:]
            if argv:
                sys.setproctitle('%s: leader %s' % (nm, ' '.join(argv)))
            else:
                sys.setproctitle('%s: leader' % (nm,))
            if confpath:
                log(confpath, 'LOAD')
            else:
                log('profile', 'WARN')

        p = None
        for worker_id in range(1, workers):
            cmd = [sys.executable, sys.apppath, 'worker=%s' % worker_id]
            cmd.extend(sys.argv[1:])
            #print(cmd)
            p = sp.Popen(cmd)
            pool.append(p)
            time.sleep(0)

        if workers > 1:
            worker_id =-1
            cmd = [sys.executable, sys.apppath, 'worker=%s' % 0]
            cmd.extend(sys.argv[1:])
            p = sp.Popen(cmd)
            pool.append(p)
            #print(p)
            #print(dir(p))
            #print(p.args)
            c =-1
            while pool:
                #pool = [time.sleep(0) or p for p in pool if p.poll() is None]
                t1 = time.time()
                for i, p in enumerate(pool):
                    time.sleep(0.001)
                    if p.poll() is None:
                        continue
                    pool[i] = sp.Popen(p.args)

                new_c = len(pool)
                if c != new_c:
                    c = new_c
                    log(c, 'pool')
                t2 = time.time()
                if t2 > t1:
                    t = 2 + t1 - time.time()
                    #log(t, 'time')
                    if t > 0:
                        time.sleep(t)
        else:
            #if confpath:
            #    log(confpath, 'LOAD')
            #else:
            #    log('profile', 'WARN')
            worker_id = int(sys.conf.get('worker', '0'))
            _main(worker_id)

    except (KeyboardInterrupt, SystemExit) as e:
        #print('\r\n', end='', flush=True)
        pass
    except:
        log(None)
    finally:
        try:
            time.sleep(0.1)
        except:
            pass
        try:
            print('\r', end='', flush=True)
        except:
            pass
        for p in pool:
            try:
                p.send_signal(signal.SIGINT)
            except:
                try:
                    p.send_signal(signal.CTRL_C_EVENT)
                except:
                    pass
            try:
                time.sleep(0.001)
            except:
                pass
        try:
            time.sleep(0.2)
        except:
            pass
        for p in pool:
            p.terminate()
            if hasattr(p, 'join'):
                p.join()
            else:
                p.wait()
        if workers > 1:
            try:
                time.sleep(0.1)
            except:
                pass
            log('shutdown', kind='pool', begin='\r')

def _main(worker_id):
    global __hostname__, __appname__,__profile__, __version__, __index__

    from botserver import BOTServer
    name = '%s.%s' % (__appname__, __profile__)
    serv = BOTServer(name, ('127.0.0.1', 4222))
    serv.register_function(lambda: __hostname__, 'hostname')
    serv.register_function(lambda: __version__, 'ver')
    serv.register_function(lambda *a, **kw: {'appname': __appname__, 'version': __version__, 'profile': __profile__}, 'system.appinfo')

    # import api
    # import api.myapi
    from api.sklad import SKLAD
    _api = SKLAD(log=log)
    _api._system_list_methods = lambda obj, func_name=None: None
    # serv.register_function(_api, 'remote_api')
    serv.register_instance(_api, 'remote_api')

    # def _udf(text, *params, **kwargs):
    #     _d = {}  # {'rpc': self, 'params': params, 'kwargs': kwargs}
    #     o = compile(text, '<string>', 'exec')
    #     #exec text in globals(), _d
    #     exec(o, globals(), _d)
    #     func = _d.get('main')
    #     if func:
    #         return func(_api, *params, **kwargs)
    #     return _d.get('result')
    # serv.register_function(_udf, 'udf')

    try:
        import api.myhttp as http
        serv._http = types.MethodType(http._http, serv)
        serv.register_function(serv._http, '.http')
    except:
        log(None)

    if True:
        nm = '%s.%s' % (__appname__, __profile__)
        if worker_id >-1:
            sys.setproctitle('%s: worker%s' % (nm, worker_id))
        else:
            argv = sys.argv[1:]
            if argv:
                sys.setproctitle('%s: leader %s' % (nm, ' '.join(argv)))
            else:
                sys.setproctitle('%s: leader' % (nm,))

    log('worker%s' % worker_id, kind='NATS')
    try:
        serv.serve_forever()
    except (KeyboardInterrupt, SystemExit) as e:
        log('worker%s' % worker_id , kind='STOP', begin='\r')
    except:
        log(None)

"""
def master():
    appname = 'fdbsrv'
    sys.DATA_TEMP_DIR = os.path.join(sys.TEMP_DIR, 'apps', appname, 'data')
    if not os.path.exists(sys.DATA_TEMP_DIR):
        os.makedirs(sys.DATA_TEMP_DIR)
    if 'dar' == sys.platform[:3].lower():
        _dir = '/opt'
    else:
        _dir = '/home'
    sys.DATA_LOCAL_DIR = os.path.join(_dir, 'apps.local', appname, 'data')
    if not os.path.exists(sys.DATA_LOCAL_DIR):
        os.makedirs(sys.DATA_LOCAL_DIR)

    sys.DATA_SHARED_DIR = os.path.join(_dir, 'apps', appname, 'data')
    if not os.path.exists(sys.DATA_SHARED_DIR):
        os.makedirs(sys.DATA_SHARED_DIR)
"""

__appname__ = '<appname>'
__profile__ = __hostname__  # 'default'
__index__   = os.getpid()

_ts = "%Y-%m-%d %H:%M:%S"
def log(msg, kind='info', begin='', end='\n', traceback_head='Traceback (most recent call last):'):
    global _ts, __hostname__, __appname__, __profile__, __version__, __index__
    try:
        try:
            ts = time.strftime(_ts)
        except:
            ts = time.strftime(_ts)
        if msg is None:
            data = ''.join(
                ('%s %s %s.%s %s %s:%s %s\n' % (ts, __hostname__, __appname__,__profile__,__version__,__index__,'traceback', msg)
                if i else '%s %s %s.%s %s %s:%s\n' % (ts, __hostname__, __appname__,__profile__,__version__,__index__, traceback_head)
                ) for i, msg in enumerate(traceback.format_exc().splitlines())
            )
        else:
            if type(msg) in (list, tuple):
                data = ''.join('%s%s %s %s.%s %s %s:%s %s%s' % (begin,ts, __hostname__, __appname__,__profile__,__version__,__index__,kind, row,end) for row in msg)
            else:
                data = '%s%s %s %s.%s %s %s:%s %s%s' % (begin,ts, __hostname__, __appname__,__profile__,__version__,__index__,kind, msg,end)
        sys.stdout.write(data)
        sys.stdout.flush()
    except:
        pass
        #traceback.print_exc()

try:
    sys.log
    log = sys.log
except:
    sys.log = log

def init():
    # import multiprocessing as mp
    mp.freeze_support()
    mp.set_start_method('spawn')


if __name__ == '__main__':
    init()
    main()
