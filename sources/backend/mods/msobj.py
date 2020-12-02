# coding: utf-8

from __future__ import absolute_import, with_statement, print_function, unicode_literals

__version__ = '20.312.0001'  # MSLock
#__version__ = '20.311.2118'  # MSDict
#__version__ = '20.311.1750'

import sys, os, time, socket, json, uuid, datetime
import socket
import threading
from pprint import pprint

PY2 = sys.version_info[0] < 3
PY3 = sys.version_info[0] > 2
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


if __name__ == "__main__":
    import botclient as bc
else:
    from . import botclient as bc

# import botclient as bc
try:
    BOT = sys.BOT
except:
    BOT = sys.BOT = bc.BOTProxy('')


class MSDict(object):

    def __init__(self, kv_name='', kv_prefix='', api_key='', timeout=(3,5)):
        self._alias = 'yc/shared_obj'
        self._bot = BOT('dbbot.shared-obj', bot=True, sync=timeout)

        if kv_name:
            self._kv_name = kv_name
        else:
            self._kv_name = 'kv'
        self._kv_prefix = kv_prefix

        self.fg_init_err = True
        self._sql_create_table = ["CREATE TABLE IF NOT EXISTS %s(k TEXT PRIMARY KEY, v TEXT);" % self._kv_name,]
        try:
            self.fg_init_err = self._cmd(self._sql_create_table)[0] is not None
        except:
            log(None)

    def cmd(self, x):
        if self.fg_init_err:
            self.fg_init_err = self._cmd(self._sql_create_table)[0] is not None
        return self._cmd(x)

    def _cmd(self, x):
        r = self._bot.fdb.execute(self._alias, x)
        #print(r)
        return r

    def __setitem__(self, k, v):
        _k = self._kv_prefix + k
        sql = "insert into %s(k,v)values(%%s,%%s)on conflict (k) do update set v = excluded.v;" % self._kv_name
        self.cmd([[sql, [_k, v]],])

    def __getitem__(self, k):
        _k = self._kv_prefix + k
        sql = "select v from %s where k = %%s;" % self._kv_name
        rows = self.cmd([[sql, [_k,]],])
        if rows:
            row = rows.pop(0)
            if row:
                return row[0][0]

    def __delitem__(self, k):
        _k = self._kv_prefix + k
        sql = "delete from %s where k=%%s;" % self._kv_name
        self.cmd([[sql, [_k,]],])

    def __iter__(self):
        for k in self.keys():
            yield k

    def clear(self, k=''):
        k = self._kv_prefix + k
        if k:
            self.cmd(["delete from %s where k like '%s%%';" % (self._kv_name, k.replace("'", "''")),])
        else:
            self.cmd(["delete from %s;" % (self._kv_name)])

    def get(self, k, v=None):
        _k = self._kv_prefix + k
        sql = "select v from %s where k = %%s;" % self._kv_name
        rows = self.cmd([[sql, [_k,]],])
        if rows:
            row = rows.pop(0)
            if row:
                return row[0][0]
        return v

    def pop(self, k, v=None):
        _k = self._kv_prefix + k
        sql1 = "select v from %s where k = %%s;" % self._kv_name
        sql2 = "delete from %s where k=%%s;" % self._kv_name
        rows = self.cmd([
            [sql1, [_k,]],
            [sql2, [_k,]]
        ])
        if rows[0]:
            row = rows[0].pop(0)
            if row:
                return row[0]
        return v

    def popitem(self):
        if self._kv_prefix:
            sql1 = "select k,v from %s where k like '%s%%' limit 1;" % (self._kv_name, self._kv_prefix.replace("'", "''"))
        else:
            sql1 = "select k,v from %s limit 1;" % self._kv_name
        rows = self.cmd(sql1)
        if rows:
            row = rows.pop(0)
            if row:
                k, v = row
                sql2 = "delete from %s where k='%s';" % (self._kv_name, k.replace("'", "''"))
                self._cmd(sql2)
                return k, v

    def keys(self, k=''):
        k = self._kv_prefix + k
        if k:
            rows = self.cmd("select k from %s where k like '%s%%';" % (self._kv_name, k.replace("'", "''")))
        else:
            rows = self.cmd("select k from %s;" % self._kv_name)
        if rows:
            return [row[0] for row in rows]
        return []

    def values(self, k=''):
        k = self._kv_prefix + k
        if k:
            rows = self.cmd("select v from %s where k like '%s%%';" % (self._kv_name, k.replace("'", "''")))
        else:
            rows = self.cmd("select v from %s;" % self._kv_name)
        if rows:
            return [row[0] for row in rows]
        return []

    def items(self, k=''):
        k = self._kv_prefix + k
        if k:
            rows = self.cmd("select k,v from %s where k like '%s%%';" % (self._kv_name, k.replace("'", "''")))
        else:
            rows = self.cmd("select k,v from %s;" % self._kv_name)
        if rows:
            return rows
        return []

    def __len__(self):
        if self._kv_prefix:
            rows = self.cmd("select count(*) from %s where k like '%s%%';" % (self._kv_name, self._kv_prefix.replace("'", "''")))
        else:
            rows = self.cmd("select count(*) from %s;" % self._kv_name)
        if rows:
            return rows.pop(0)[0]
        return 0

    def update(self, *a, **F):
        """
        D.update([E, ]**F) -> None.  Update D from dict/iterable E and F.
        If E present and has a .keys() method, does:     for k in E: D[k] = E[k]
        If E present and lacks .keys() method, does:     for (k, v) in E: D[k] = v
        In either case, this is followed by: for k in F: D[k] = F[k]
        """
        sql = "insert into %s(k,v)values(%%s,%%s)on conflict (k) do update set v = excluded.v;" % self._kv_name
        q = []
        for E in a:
            if hasattr(E, 'keys'):
                q.extend([sql, [self._kv_prefix + k, E[k]]] for k in E)
            else:
                q.extend([sql, [self._kv_prefix + k, v]] for (k, v) in E)
        if F:
            q.extend([sql, [self._kv_prefix + k, F[k]]] for k in F)
        if q:
            self.cmd(q)

    def set(self, k, v):
        self.__setitem__(k, v)
        if k in self:
            return k

    def delete(self, k):
        return self.__delitem__(k)

    def length(self):
        return self.__len__()

import weakref
class MSLock(object):

    def __init__(self, api_key='', timeout=(3,5), owner=None):
        self._alias = 'yc/shared_obj'
        self._bot = BOT('dbbot.shared-obj', bot=True, sync=timeout)
        self._kv_name = 'locks'

        self._lock_list = {}
        self._lck = threading.RLock()
        if owner:
            self._owner = owner
        else:
            self._owner = uuid.uuid4().hex

        self.fg_init_err = True
        self._sql_create_table = [
            "CREATE TABLE IF NOT EXISTS %s(lock TEXT PRIMARY KEY, owner TEXT, dt_lck TEXT default '2001-01-01 00:00:00');" % self._kv_name,
        ]
        try:
            self.fg_init_err = self._cmd(self._sql_create_table)[0] is not None
        except:
            log(None)

        self.__mainThread = threading.current_thread()
        self.__initialised = threading.Event()
        self.__destroying = False
        self.__thread = threading.Thread(target=MSLock._run, args=(weakref.proxy(self),))
        self.__thread.daemon = True
        self.__thread.start()
        self.__initialised.wait()

    def cmd(self, x):
        if self.fg_init_err:
            self.fg_init_err = self._cmd(self._sql_create_table)[0] is not None
        return self._cmd(x)

    def _cmd(self, x):
        r = self._bot.fdb.execute(self._alias, x)
        #print(r)
        return r

    def tryAcquire(self, lockname, sync=True, timeout=None):
        try:
            return self._lock(lockname, seconds=timeout)
        except:
            log(None)
        return False

    def _lock(self, lockname, seconds):
        if seconds is None:
            seconds = 64
        sql = [
            self._sql_del(lockname),
            self._sql_ins(lockname, seconds=seconds)
        ]
        r = self._cmd(sql)
        #print('-'*16)
        #pprint(sql)
        #print('_lock', r)  #, r[1][0][0])
        fg = r[1] and r[1][0][0] == self._owner
        if fg:
            with self._lck:
                self._lock_list[lockname] = seconds
        return fg

    def isAcquired(self, lockname):
        with self._lck:
            return self._lock_list and (lockname in self._lock_list)

    def release(self, lockname):
        try:
            return self._unlock(lockname)
        except:
            log(None)
        return False

    def _unlock(self, lockname):
        with self._lck:
            if lockname in self._lock_list:
                del self._lock_list[lockname]
        lcknm = lockname.replace("'", "''")
        sql = [
            self._sql_del(lockname),
            "select lock from locks where lock = '%s';" % lcknm
            #"select lock from locks where lock = '%s' and owner = '%s';" % (lcknm, self._owner)
        ]
        r = self._cmd(sql)
        #print('-'*16)
        #pprint(sql)
        #print('_unlock:', r)
        fg = r[1] is None
        #fg = 1 == r[0].get('rows_affected', 0)
        return fg

    def _sql_del(self, lockname):
        lcknm = lockname.replace("'", "''")
        return "delete from locks where lock = '%s' and (owner = '%s' or dt_lck < to_char(now() at time zone 'utc', 'YYYY-mm-dd HH24:MI:SS'))" % (lcknm, self._owner)

    def _sql_ins(self, lockname, seconds):
        lcknm = lockname.replace("'", "''")
        return "insert into locks(lock, owner, dt_lck)values('%s', '%s', '%s')on conflict (lock) do nothing returning owner;" % (lcknm, self._owner, self._utcnow(seconds=seconds))

    def _sql_upd(self, lockname, dt_lck):
        lcknm = lockname.replace("'", "''")
        return "update locks set dt_lck = '%s' where lock = '%s' and owner = '%s' returning owner;" % (dt_lck, lcknm, self._owner)

    def _run(self):
        self.__initialised.set()
        c = 0
        try:
            while not self.__destroying and self.__mainThread.is_alive():
                time.sleep(0.1)
                c += 1
                if c % 160 != 0:
                    continue
                c = 0
                try:
                    self._refresh()
                #except (socket.timeout,) as e:
                #    log('LOCK <%s> has no connect' % self._alias, 'WARN')
                except ReferenceError:
                    break
                except:
                    log(None)
        except ReferenceError:
            pass

    def _refresh(self):
        #print('_refresh', flush=True)
        names = []
        with self._lck:
            sql = [names.append(lockname) or self._sql_upd(lockname, self._utcnow(seconds)) for lockname, seconds in self._lock_list.items()]
        #pprint(sql)
        if sql:
            r = self._cmd(sql)
            #print('-'*16)
            #pprint(sql)
            #print('_refresh:', r)
            names = [names[i] for i, a in enumerate(r) if a is None or ((a[0] is None) or not (self._owner in a[0]))]
            #names = [names[i] for i, a in enumerate(r) if 0 == a.get('rows_affected', 0)]
            if names:
                with self._lck:
                    for lockname in names:
                        if lockname in self._lock_list:
                            del self._lock_list[lockname]

    def _utcnow(self, seconds=0):
         return (datetime.datetime.utcnow() + datetime.timedelta(seconds=seconds)).strftime('%Y-%m-%d %H:%M:%S')

    def close(self):
        try:
            self._close()
        except:
            log(None)

    def _close(self):
        self.__destroying = True
        with self._lck:
            sql = [self._sql_del(lockname) for lockname, seconds in self._lock_list.items()]
            self._lock_list = None
        if sql:
            self._cmd(sql)
        #print(111, id(self), self)

    def __del__(self):
        self.close()


def _ri(text='>> '):
    if raw_input(text).split():
        os._exit(0)

_ts = "%Y-%m-%d %H:%M:%S"
try:
    log = sys.log
except:
    import traceback
    log = lambda *a, **kw: sys.stdout.write('test >> %s' % (traceback.format_exc() if a[0] is None else a[0]) + '\n')


################################################


def test1():
    o = MSDict()
    #print(o)
    """
    o['k1'] = 1
    o['k2'] = 'v2'
    o['k3'] = 'v3'
    o['m4'] = 'v4'
    o['m5'] = 'v5'
    o['k6'] = 'v6'
    o['k7'] = 'v7'
    #"""
    #o.clear()
    #print(o['k3'])
    #del o['k2']
    #print('k2:', o['k2'])
    #print(o.get('k33', '333'))
    #print(o.pop('k3', 333))
    #print(o.popitem())
    #print(o.keys())
    #print(o.values())
    #o.update({'k4': 'v44', 'k5': 'v55'}, [('k7','v77'), ('k9', 'v99'), ('k0', 'v00')], k2='vv2', Privet=u'Мир3')
    #pprint(o.items())
    print(len(o))
    #print(o.set('k0', 'v0'))
    #o.delete('k0')
    #print(o.length())

def test2():
    owner = '%s.%s.%x' % (socket.gethostname().lower(), os.getpid(), id(threading.current_thread()))
    sys.lock = MSLock(api_key='', timeout=5, owner=owner)
    print(sys.lock)
    #return

    #print(sys.lock.status())
    #print(sys.lock._leader, sys.lock._nodes)
    #pprint(sys.lock.status())
    #print(sys.lock._leader, sys.lock._nodes)
    lockname = 'test1'
    print('unlock:', lockname, sys.lock.release(lockname))
    _ri()

    print('[test0]', sys.lock.tryAcquire('test0', sync=True))
    print('[test2]', sys.lock.tryAcquire('test2', sync=True))

    lockname = 'test1'
    if sys.lock.tryAcquire(lockname, sync=True):
        print('[LOCK]', lockname)
        _ri()
        print('UNLOCK', lockname, sys.lock.release(lockname))
    else:
        print('[FAIL]', lockname)
    _ri()
    #print('test0', sys.lock.release('test0'))
    #print('test1', sys.lock.release('test2'))
    del sys.lock  # .close()
    _ri('!! ')


if '__main__' == __name__:
    #test1()
    test2()

