# coding: utf-8

import sys, os, time, zipimport

def main():
    global _zip_main
    modulename = _zip_main if _zip_main[-4:] != '-dev' else _zip_main[:-4]
    sys.FG_RELOAD = True
    while sys.FG_RELOAD:
        sys.FG_RELOAD = False
        m = sys.reload(modulename)
        if hasattr(m, 'init'):
            m.init()
        m.main()

_zip_name = sys.argv[0]
_zip_main = os.path.basename(_zip_name).split('.', 1)[0]
_zip_stat = None
_zip_time = None
_zip_cache = {}
def _zip_import(*names, obj=None):
    global _zip_name, _zip_main, _zip_stat, _zip_time, _zip_cache
    if len(names) == 1:
        names = tuple(tuple(x.strip().split()) for x in names[0].split(','))
    if obj:
        obj = sys.modules[obj]
    if _zip_stat is None:
        _zip_stat = os.stat(_zip_name)
        _zip_time = time.time()
    name0 = names[0][0] if type(names[0]) is tuple else names[0]
    if names and name0 == _zip_main:
        _new_time = time.time()
        if _new_time - _zip_time >= 1:
            _zip_time = _new_time
            _new_stat = os.stat(_zip_name)
            if _zip_stat.st_size != _new_stat.st_size or int(_zip_stat.st_mtime) != int(_new_stat.st_mtime):
                _zip_stat = _new_stat
                del sys.path_importer_cache[_zip_name]
                if _zip_name in zipimport._zip_directory_cache:
                    del zipimport._zip_directory_cache[_zip_name]
                z = zipimport.zipimporter(_zip_name)
                sys.path_importer_cache[_zip_name] = z
                _zip_cache = {}
    _z_cache = sys.path_importer_cache[_zip_name]
    r = []
    for name in names:
        nm = ''
        if type(name) is tuple:
            if len(name) > 1:
                name, nm = name[0], name[1]
            else:
                name = name[0]
        if name in _zip_cache:
            m = _zip_cache[name]
        else:
            _name = name.replace('.', os.sep)
            m = _z_cache.load_module(_name)
            _zip_cache[name] = m
        if obj:
            if not nm:
                nm = name.rsplit('.', 1)[-1]
            setattr(obj, nm, m)
        else:
            r.append(m)
    if obj:
        return
    else:
        if len(r) > 1:
            return r
        elif r:
            return r[0]
sys.reload = _zip_import


if '__main__' == __name__:
    main()
