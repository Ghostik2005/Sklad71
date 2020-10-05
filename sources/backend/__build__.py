#!/ms71/mini/bin/python
# coding: utf-8

__version__ = '20.129.1750'

import sys
if __name__ == '__main__':
    # env PYTHONIOENCODING="UTF-8"
    if sys.stdout.encoding != 'UTF-8':
        sys.stdout = open(sys.stdout.fileno(), mode='w', buffering=1, encoding='UTF-8')
    if sys.stderr.encoding != 'UTF-8':
        sys.stderr = open(sys.stderr.fileno(), mode='w', buffering=1, encoding='UTF-8')

import os, time, glob, zipfile, subprocess as sp, signal
import traceback
nv = lambda: time.strftime("%y.%j.%H%M")
import socket
__hostname__ = socket.gethostname().lower()
import uuid, hashlib, base64

MYMOD = '%s.py' % os.path.basename(os.path.dirname(os.path.abspath(__file__)))
def get_files(appname, version):
    global MYMOD
    masks = ['__main__.py', 'botserver.py', 'botclient.py', 'toml/*.py', MYMOD, 'api/*.py',
        ]
    for mask in masks:
        for nm in glob.iglob(mask):
            if os.path.isdir(nm):
                continue
            bn = os.path.basename(nm)
            if MYMOD == bn:
                data = load(nm)
                if sys.FG_RELEASE:
                    data = data.replace(b'<appname>', appname.encode(), 1).replace(b'<version>', version.encode(), 1)
                else:
                    data = data.replace(b'<appname>', appname.encode() + b'-dev', 1).replace(b'<version>', version.encode(), 1)
                yield nm, data, False
            elif bn in ('botserver.py', 'botclient.py'):
                yield nm, load(nm).rsplit(b'################################', 1)[0], False
            else:
                yield nm, load(nm), False


    path = "assets"

    for nm in walk(path):
        _nm = "assets" + nm[len(path):]
        ext = os.path.splitext(nm)[1]
        data = load(nm)
        if len(data) > 1400 and ext in (".html", ".css", ".js"):
            data = gzip_encode(data)
            _nm += '.gz'
            yield _nm, data, True
        else:
            yield _nm, data, False

sys.FG_RUN = False
if 'run' in sys.argv:
    sys.FG_RUN = True
    sys.argv.remove('run')

sys.FG_RELEASE = False
sys.profiles = []
if 'r' in sys.argv:
    sys.FG_RELEASE = True
    sys.argv.remove('r')
    sys.profiles = sys.argv[1:]
    if not sys.profiles:
        sys.profiles = [__hostname__,]
if 'release' in sys.argv:
    sys.FG_RELEASE = True
    sys.argv.remove('release')
    sys.profiles = None

sys.FG_DEV = False
if 'dev' in sys.argv:
    sys.FG_RUN = False
    sys.FG_RELEASE = False
    sys.FG_DEV = True
    sys.argv.remove('dev')


def main():
    dn = os.path.dirname(os.path.abspath(__file__))
    os.chdir(dn)
    appname = os.path.basename(dn)
    version = nv()
    #print('sys.FG_RELEASE:', sys.FG_RELEASE)
    if sys.FG_RELEASE:
        if sys.profiles:
            #print(sys.profiles)
            #return
            pass
        elif sys.profiles is None:
            pass
        else:
            print('Exit: specify a list of profiles for mybot')
            sys.stdout.flush()
            return
        buildname = '%s.%s.zip' % (appname, version)
        s = '%s (%s)' % (buildname, 'RELEASE')
    elif sys.FG_DEV:
        buildname = '%s-dev.zip' % appname
        s = '%s (%s)' % (buildname, 'DEV')
    else:
        buildname = '%s.zip' % appname
        s = '%s (%s)' % (buildname, version)
    print('--', s, "-"*(32-len(s)))
    sys.stdout.flush()
    buildpart = buildname + '.part'
    zf = None
    for nm, data, fg_gzip in get_files(appname, version):
        if nm.find('test') >-1:
            continue
        if zf is None:
            try: os.remove(buildpart)
            except: pass
            zf = zipfile.ZipFile(buildpart, 'w', zipfile.ZIP_DEFLATED)
        print(nm, flush=True)
        if fg_gzip:
            zf.writestr(nm, data, zipfile.ZIP_STORED)
        else:
            zf.writestr(nm, data)
        sys.stdout.flush()
    if zf:
        zf.close()
    try: os.remove(buildname)
    except: pass
    os.rename(buildpart, buildname)
    print('++', buildname, "-"*(32-len(buildname)))
    print()
    sys.stdout.flush()

    if sys.FG_DEV:
        import requests
        fg = False
        print('UPLOAD:', buildname, flush=True)
        with open(buildname, 'rb') as f:
            url = 'http://repo.mshub.ru:8090/.upload/%s/%s' % (appname, buildname)
            with requests.put(url, data=f, timeout=(5, 7)) as r:
                fg = r.ok
                if not fg:
                    print('%s:' % buildname, r.status_code, r.reason, flush=True)
        return

    if sys.FG_RELEASE:
        import requests
        # msbot.20.098.1348.zip msbot 20.098.1348 None
        #print(buildname, appname, version, sys.profiles)
        #os._exit(0)

        fg = False
        print('UPLOAD:', buildname, flush=True)
        with open(buildname, 'rb') as f:
            url = 'http://repo.mshub.ru:8090/.upload/%s/%s' % (appname, buildname)
            with requests.put(url, data=f, timeout=(5, 7)) as r:
                fg = r.ok
                if not fg:
                    print('%s:' % buildname, r.status_code, r.reason, flush=True)
        if fg:
            if not sys.profiles:
                print('UPLOAD:', '%s.zip' % appname, flush=True)
                with open(buildname, 'rb') as f:
                    url = 'http://repo.mshub.ru:8090/.upload/%s/%s' % (appname, '%s.zip' % appname)
                    #print('url:', url, flush=True)
                    with requests.put(url, data=f, timeout=(5, 7)) as r:
                        if not r.ok:
                            print('%s.zip:' % appname, r.status_code, r.reason, flush=True)
            #print('SAVE')
            os.remove(buildname)
            if sys.profiles:
                for profile in sys.profiles:
                    with requests.put('http://repo.mshub.ru:8090/.upload/%s/%s' % (appname, '.new.%s' % profile), data=buildname.encode(), timeout=(5, 7)) as r:
                        if r.ok:
                            print('PROF:', profile)
                        else:
                            print('PROF:', profile, (r.status_code, r.reason))
            else:
                with requests.put('http://repo.mshub.ru:8090/.upload/%s/%s' % (appname, '.new'), data=buildname.encode(), timeout=(5, 7)) as r:
                    if r.ok:
                        print('SAVE')
                    else:
                        print('SAVE:', r.status_code, r.reason)
        print('END', flush=True)
        return


    cmd = [sys.executable, buildname] + sys.argv[1:]
    if len(cmd) > 2 or sys.FG_RUN:
        p = None
        try:
            p = sp.Popen(cmd)  # , stdout=sp.PIPE, stderr=sp.PIPE)
            rc = p.poll()
            while rc is None:
                time.sleep(0.5)
                rc = p.poll()
        except (KeyboardInterrupt, SystemExit) as e:
            if p:
                try:
                    p.send_signal(signal.SIGINT)
                except:
                    p.send_signal(signal.CTRL_C_EVENT)
                time.sleep(0.2)
                #rc = p.poll()
                #while rc is None:
                #    time.sleep(0.1)
                #    rc = p.poll()
        finally:
            if p:
                try:
                    p.terminate()
                    if hasattr(p, 'join'):
                        p.join()
                    else:
                        p.wait()
                except:
                    pass

def load(filename):
    with open(filename, 'rb') as f:
        return f.read()

def walk(path):
    from os.path import join, getsize
    for root, dirs, files in os.walk(path, followlinks=True):
        for nm in files:
            yield os.path.join(root, nm)

from io import BytesIO
try:
    import gzip
except ImportError:
    gzip = None  # python can be built without zlib/gzip support
def gzip_encode(data):
    """data -> gzip encoded data

    Encode data using the gzip content encoding as described in RFC 1952
    """
    if not gzip:
        raise NotImplementedError
    f = BytesIO()
    with gzip.GzipFile(mode="wb", fileobj=f, compresslevel=1) as gzf:
        if data.__class__.__name__ in ("generator", "list", "tuple"):
            for row in data:
                gzf.write(row)
        elif hasattr(data, "read"):
            part = data.read(4096)
            while part:
                gzf.write(part)
                part = data.read(4096)
        else:
            gzf.write(data)
        #gzf.close()
    encoded = f.getvalue()
    f.close()
    return encoded

def urn5(name):
    h5 = hashlib.md5(uuid.NAMESPACE_DNS.bytes)
    h5.update(name.encode())
    return base64.b16encode(h5.digest()).decode('utf8').lower()

def get_file_range(filename, batch=1048576):
    with open(filename, 'rb') as f:
        size = f.seek(0, 2)
        f.seek(0, 0)
        start, stop = -1, 0
        while start < size:
            start = stop
            part = f.read(batch)
            stop = start + len(part)
            yield (start, stop - 1), size, part
            start = stop

########################################################################



if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(flush=True)
    #sys.exit(0)
