# coding: utf-8

import sys
import time
import requests
from threading import RLock
import json
import bz2
import glob
import os
import socket
import subprocess
import traceback
import tempfile
import threading
from datetime import timedelta
from datetime import datetime

if __name__ == "__main__":
    import botclient
else:
    from . import botclient

class SKLAD:

    def __init__(self, log=None):

        sys.BOT = botclient.BOTProxy('', ('127.0.0.1', 4222))

        self._test = True if os.getenv('HOME').lower().find('ghostik11')>-1 else False

        print(self._test)

        self.database = 'new_sklad_test' if self._test else 'hoznuzhdy'

        self.log = log

        self._range_no = 10 # 0, 1, 10, 100
        self.temp_dir = tempfile.TemporaryDirectory(prefix='price_generator_')
        self.temp_dir = self.temp_dir.name
        os.mkdir(self.temp_dir)
        # self.RPC = botclient.BOTProxy('dbbot.plx-db0', ('127.0.0.1', 4222))
        # self.RPC = botclient.BOTProxy('dbbot.test', ('127.0.0.1', 4222))
        # self.RPC = botclient.BOTProxy('dbbot.sklad', ('127.0.0.1', 4222))
        self.RPC = sys.BOT('dbbot.sklad', bot=True)
        self._set_gen_id()

        self._lockname = "order_processor"

        try:
            from . import msobj
            owner = '%s.%s.%x' % (socket.gethostname().lower(), os.getpid(), id(threading.current_thread()))
            print(owner)
            self.ms_lock = msobj.MSLock(api_key='', timeout=5, owner=owner)
        except ImportError:
            self.ms_lock = None


        try:
            from . import generate_report
        except ImportError:
            self.report = self.__not_implemented
        else:
            self.report = generate_report.REPORT(self)

        try:
            from . import balances
        except ImportError:
            self.balances = self.__not_implemented
        else:
            self.balances = balances.BALANCE(self)

        try:
            from . import shipments
        except ImportError:
            self.shipments = self.__not_implemented
        else:
            self.shipments = shipments.SHIPMENTS(self)

        try:
            from . import movements
        except ImportError:
            self.movements = self.__not_implemented
        else:
            self.movements = movements.MOVEMENTS(self)

        try:
            from . import orders
        except ImportError:
            self.orders = self.__not_implemented
        else:
            self.orders = orders.ORDERS(self)

        try:
            from . import arrivals
        except ImportError:
            self.arrivals = self.__not_implemented
        else:
            self.arrivals = arrivals.ARRIVALS(self)

        try:
            from . import rests
        except ImportError:
            self.rests = self.__not_implemented
        else:
            self.rests = rests.RESTS(self)

        try:
            from . import generate_report
        except ImportError:
            self.generate_report = self.__not_implemented
        else:
            self.generate_report = generate_report.REPORT(self)


    def connect_api(self, BOT):
        # api_key = "11ce07710c41434fa66fad6ba2c3cb0d"
        # rpc = jsonrpclib.ServerProxy("https://sklad71.org/apps/cnvsrv/uri/RPC2", api_key=api_key)
        name = 'cnvsrv.default'
        rpc = BOT(name, bot=True)
        return  rpc

    #сохраняет двоичные данные с заданным расширением (по умолчанию ods)
    #возвращает хеш md5
    def filesave(self, payload, ext='ods'):

        rpc = self.connect_api(sys.BOT)
        result = None
        try:
            cnv = rpc.cnv
            data = open(payload, "rb").read()
            # print 'data', len(data)
            binary = botclient.Binary(data)
            # print 'binary ', len(binary.encode())
            result = cnv.filesave(binary, ext=ext)
        except:
            traceback.print_exc()
        finally:
            return result


    def exec_every_n_seconds(self, n, f):
        first_called=datetime.now()
        f()
        num_calls=1
        drift=timedelta()
        time_period=timedelta(seconds=n)
        while 1:
            time.sleep(n-drift.microseconds/1000000.0)
            current_time = datetime.now()
            f()
            num_calls += 1
            difference = current_time - first_called
            drift = difference - time_period* num_calls


    def at_exit(self):
        if self.temp_dir and os.path.exists(self.temp_dir):
            import shutil
            shutil.rmtree(self.temp_dir)
        if hasattr(self.generate_report, 'at_exit'):
            self.generate_report.at_exit()

    def _print(self, *msg):

        if self.log:
            self.log(' '.join([str(i) for i in msg]), kind='sklad_info')
        else:
            print(*msg)


    def get_test(self):
        return "test"

    def _request(self, sql):
        return self.RPC('fdb.execute', sync=(1, 7))(f'ms/{self.database}.ro', sql)
        # _c = self.RPC('fdb', sync=(1, 7))
        # self._print('+'*20)
        # self._print(_c)
        # # return _c.execute('nomad/new_sklad_test.ro', sql)
        # return _c.execute('ms/new_sklad_test', sql)

    def _execute(self, sql):
        _c = self.RPC('fdb')
        return _c.execute(f'ms/{self.database}', sql)

    def _uid_range(self):
        with requests.get('http://mshub.ru/ext/uid%s' % self._range_no, timeout=(3, 5), verify=False) as f:
            _min, _max = f.text.split()[:2]
            self._print(_min, _max)
            return int(_min), int(_max)

    def __not_implemented(self):
        return "not_implemented"

    def _set_gen_id(self):
        try:
            _min, _max = self._uid_range()
        except:
            pass
        else:
            sql = f"""ALTER SEQUENCE IF EXISTS gen_id
    --MINVALUE {_min}
    MAXVALUE {_max}
    START {_min+1}
    RESTART {_min+1}"""
            ret = self._execute(sql)


    def gen_doc_number(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " gen_doc_number ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " gen_doc_number ", "*"*10)
        doc_type = kwargs.get('doc_type')
        if doc_type == 'rest':
            sql = f"""SELECT nextval('rest_num');"""
            pass
        elif doc_type == 'movement':
            sql = f"""SELECT nextval('movement_num');"""
            pass
        elif doc_type == 'arrival':
            sql = f"""SELECT nextval('arrival_num');"""
            pass
        elif doc_type == 'shipment':
            sql = f"""SELECT nextval('shipment_num');"""
            pass
        else:
            sql = f"""select 9999999"""

        rows = self._request(sql)
        t1 = time.time() - t
        ret = rows[0][0]
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def products_checkmark(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " checkmark ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " checkmark ", "*"*10)
        rows = []
        field = kwargs.get("field")
        value = True if kwargs.get("value") else False
        item_code = kwargs.get("item_code")
        item_id = kwargs.get("item_id")

        if field and item_code and item_id:
            sql = f"""update ref_products
set {field} = '{str(value)}'::bool
where c_id = {item_id}
and c_nnt = '{item_code}'::text
returning c_id, c_nnt, {field}
"""
            rows = self._request(sql)
        t1 = time.time() - t
        if rows:
            ret = rows[0]
        else:
            ret = None
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def get_filter_list(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_filter_list ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_filter_list ", "*"*10)
        c_name = kwargs.get('filterName')
        doc_type = kwargs.get('docType')
        rows = []
        if c_name:
            if c_name == 'n_state':
                sql = f"""select n_value, n_id
from ref_states
order by n_value asc"""
            elif c_name == 'n_paid':
                sql = f"""select n_value, n_id
from ref_paids
order by n_value asc"""
            elif c_name == 'n_supplier':
                if doc_type == 'arrival':
                    sql = f"""select n_name, n_id
from ref_partners
where n_type in (select n_id from ref_partners_types where n_name = 'Поставщик')
order by n_name asc"""
                else:
                    sql = f"""select n_name, n_id
from ref_partners
where n_type in (select n_id from ref_partners_types where n_name != 'Точка')
order by n_name asc"""
            elif c_name == 'n_name':
                sql = f"""select n_name, n_id
from ref_partners
--where n_type = (select n_id from ref_partners_types where n_name = 'Получатель')
order by n_name asc"""
            elif c_name == 'n_recipient':
                if doc_type == 'shipment' or doc_type == 'movement' or doc_type == 'order':
                    sql = f"""select n_name, n_id
from ref_partners
where n_type in (select n_id from ref_partners_types where n_name = 'Точка')
order by n_name asc"""
                else:
                    sql = f"""select n_name, n_id
from ref_partners
where n_type in (select n_id from ref_partners_types where n_name != 'Точка')
order by n_name asc"""
            elif c_name == 'n_executor':
                sql = f"""select n_name, n_id
from ref_employees
order by n_name asc"""
            else:
                sql = f"""select distinct {c_name}, null
from journals_arrivals_headers
order by {c_name} asc"""
            rows = self._request(sql)
        t1 = time.time() - t
        ret = []
        for c, row in enumerate(rows, 1):
            r = {"id": str(row[1]) or str(c), "value": row[0]}
            ret.append(r)

        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def check_prod_code(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " check_prod_code ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " check_prod_code ", "*"*10)
        code = kwargs.get('code')
        if code:
            sql = f"""select c_nnt from ref_products where c_nnt = '{code}'"""
            r = self._execute(sql)
            result = True if not r else False
        else:
            result = 'wtf'
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": result, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def get_new_id(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_new_id ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_new_id ", "*"*10)

        sql = """select nextval('gen_id'::regclass);"""
        r = self._execute(sql)[0][0]
        t1 = time.time() - t

        t2 = time.time() - t1 - t
        answer = {"data": str(r), "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def get_states(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_states ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_states ", "*"*10)
        sql = """select n_id, n_value, n_picture, n_color, n_active
from ref_states
order by n_id
"""
        rows = self._request(sql)
        t1 = time.time() - t
        ret = {}
        for row in rows:
            ret[str(row[0])] = {
                "id": str(row[0]),
                "value": row[1],
                "picture": row[2],
                "color": row[3]
            }
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def get_translates(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_translates ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_translates ", "*"*10)

        sql = """select n_id, n_title, n_value
from service_fields_translates
order by n_id
"""
        rows = self._request(sql)
        t1 = time.time() - t
        # ret = []
        ret = {}
        for row in rows:
            ret[str(row[1])] = {"id": str(row[1]), "value": row[2]}
            # r = {
            #     "id": str(row[1]),
            #     "value": row[2]
            # }
            # ret.append(r)
        t2 = time.time() - t1 - t
        # self._print(ret)
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def _get_movement_header(self, doc_id):
        ret = []
        sql = f"""select jmh.n_id, jmh.n_number, jmh.n_state, jmh.n_dt_invoice::date, s.n_name,
rec.n_name, jmh.n_summ, jmh.n_nds, jmh.n_pos_numbers, emp.n_name,
jmh.n_base, p.n_value, jmh.n_dt_change, jmh.ctid
from journals_movements_headers jmh
join ref_paids p on (jmh.n_paid = p.n_id)
join ref_partners s on (jmh.n_supplier = s.n_id)
join ref_partners rec on (jmh.n_recipient = rec.n_id)
join ref_employees emp on (jmh.n_executor = emp.n_id)
where jmh.n_id = {int(doc_id)};
        """
        rows = self._request(sql)
        for row in rows:
            r = {
                "n_id": str(row[0]),
                "n_number": row[1],
                "n_state": row[2],
                "n_dt_invoice": row[3],
                "n_supplier": row[4],
                "n_recipient": row[5],
                "n_summ": row[6],
                "n_nds": row[7],
                "n_pos_numbers": row[8],
                "n_executor": row[9],
                "n_base": row[10],
                "n_paid": row[11],
                "n_dt_change": row[12]
            }
            ret.append(r)
        return ret


    def _get_shipment_header(self, doc_id):
        ret = []
        sql = f"""select jah.n_id, jah.n_number, jah.n_state, jah.n_dt_invoice::date, s.n_name,
rec.n_name, jah.n_summ, jah.n_nds, jah.n_pos_numbers, emp.n_name,
jah.n_base, p.n_value, jah.n_dt_change, jah.ctid
from journals_shipments_headers jah
join ref_paids p on (jah.n_paid = p.n_id)
join ref_partners s on (jah.n_supplier = s.n_id)
join ref_partners rec on (jah.n_recipient = rec.n_id)
join ref_employees emp on (jah.n_executor = emp.n_id)
where jah.n_id = {int(doc_id)};
        """
        rows = self._request(sql)
        for row in rows:
            r = {
                "n_id": str(row[0]),
                "n_number": row[1],
                "n_state": row[2],
                "n_dt_invoice": row[3],
                "n_supplier": row[4],
                "n_recipient": row[5],
                "n_summ": row[6],
                "n_nds": row[7],
                "n_pos_numbers": row[8],
                "n_executor": row[9],
                "n_base": row[10],
                "n_paid": row[11],
                "n_dt_change": row[12]
            }
            ret.append(r)
        return ret

    def _get_rest_header(self, doc_id):
        ret = []
        sql = f"""select jrh.n_id, jrh.n_number, jrh.n_state, jrh.n_dt_invoice::date,
rec.n_name, jrh.n_summ, jrh.n_nds, jrh.n_pos_numbers, emp.n_name,
jrh.n_base, jrh.n_dt_change, jrh.ctid
from journals_rests_headers jrh
join ref_partners rec on (jrh.n_recipient = rec.n_id)
join ref_employees emp on (jrh.n_executor = emp.n_id)
where jrh.n_id = {int(doc_id)};
        """
        rows = self._request(sql)
        for row in rows:
            r = {
                "n_id": str(row[0]),
                "n_number": row[1],
                "n_state": row[2],
                "n_dt_invoice": row[3],
                "n_recipient": row[4],
                "n_summ": row[5],
                "n_nds": row[6],
                "n_pos_numbers": row[7],
                "n_executor": row[8],
                "n_base": row[9],
                "n_dt_change": row[10]
            }
            ret.append(r)
        return ret

    def _get_arrival_header(self, doc_id):
        ret = []
        sql = f"""select jah.n_id, jah.n_number, jah.n_state, jah.n_dt_invoice::date, s.n_name,
rec.n_name, jah.n_summ, jah.n_nds, jah.n_pos_numbers, emp.n_name,
jah.n_base, p.n_value, jah.n_dt_change, jah.ctid
from journals_arrivals_headers jah
join ref_paids p on (jah.n_paid = p.n_id)
join ref_partners s on (jah.n_supplier = s.n_id)
join ref_partners rec on (jah.n_recipient = rec.n_id)
join ref_employees emp on (jah.n_executor = emp.n_id)
where jah.n_id = {int(doc_id)};
        """
        rows = self._request(sql)
        for row in rows:
            r = {
                "n_id": str(row[0]),
                "n_number": row[1],
                "n_state": row[2],
                "n_dt_invoice": row[3],
                "n_supplier": row[4],
                "n_recipient": row[5],
                "n_summ": row[6],
                "n_nds": row[7],
                "n_pos_numbers": row[8],
                "n_executor": row[9],
                "n_base": row[10],
                "n_paid": row[11],
                "n_dt_change": row[12]
            }
            ret.append(r)
        return ret

    def _get_moving_header(self, doc_id):
        return []

    def _get_transfer_header(self, doc_id):
        return []

    def _hold_rest_document(self, doc_id):
        sql = f"""insert into journals_products_movement (n_product_id, n_type, n_sign,
 										n_quantity, n_unit, n_document_id,
 										n_price_w_vats,
 										n_price_no_vats,
 										n_price_vats)
select (jrb.n_product->'n_product')::bigint, 'rest', true,
(jrb.n_product->'n_amount')::bigint, (jrb.n_product->'n_unit')::text,
jrb.n_doc_id::bigint,
round(((jrb.n_product->'n_price')::int + (((jrb.n_product->'n_price')::numeric * (jrb.n_product->'n_vats_base')::numeric)/100)::int)::numeric),
(jrb.n_product->'n_price')::numeric,
round(( ( (jrb.n_product->'n_price')::numeric * (jrb.n_product->'n_vats_base')::numeric)/100)::numeric)
from journals_rests_bodies jrb
where jrb.n_doc_id = {int(doc_id)} and not jrb.n_deleted;

insert into journals_products_balance
	(n_product_id,
	n_quantity,
	n_price,
    n_price_price,
	n_vat,
	n_consignment
	)
select
	(jrb.n_product->'n_product')::bigint as n_product_id,
	(jrb.n_product->'n_amount')::bigint as n_quantity,
	(jrb.n_product->'n_price')::numeric as n_price,
    (jrb.n_product->'n_price')::numeric as n_price,
	round(( ( (jrb.n_product->'n_price')::numeric * (jrb.n_product->'n_vats_base')::numeric)/100)::numeric) as n_vat,
	replace((jrb.n_product->'n_consignment')::text, '"', '') as n_consignment
from journals_rests_bodies jrb
where jrb.n_doc_id = {int(doc_id)} and not jrb.n_deleted
on conflict (n_product_id, n_price, n_vat, n_vat_included, n_warehouse, n_consignment)
do update
set
	n_quantity = journals_products_balance.n_quantity::int +
		(select (n_product->'n_amount')::int
			from journals_rests_bodies
			where n_doc_id = {int(doc_id)} and not journals_rests_bodies.n_deleted
 				and (n_product->'n_product')::bigint=journals_products_balance.n_product_id
		),
	n_dt = CURRENT_TIMESTAMP
where journals_products_balance.n_product_id in (select (n_product->'n_product')::bigint
from journals_rests_bodies
where n_doc_id = {int(doc_id)} and not n_deleted)
and journals_products_balance.n_consignment =
	(select  journals_products_balance.n_consignment
	from journals_products_balance jpb1
	where jpb1.n_id = journals_products_balance.n_id)

    returning journals_products_balance.n_id::text
        """

        # sql = f"select 1"
        self._print(sql)

        return self._execute(sql)

    def _hold_movement_document(self, doc_id):
        sql = f"""insert into journals_products_movement (n_product_id, n_type, n_sign,
 										n_quantity, n_unit, n_document_id,
 										n_price_w_vats,
 										n_price_no_vats,
 										n_price_vats)
select (jmb.n_product->'n_product')::bigint, 'movement', true,
(jmb.n_product->'n_amount')::bigint, (jmb.n_product->'n_unit')::text,
jmb.n_doc_id::bigint,
round(((jmb.n_product->'n_price')::int + (((jmb.n_product->'n_price')::numeric * (jmb.n_product->'n_vats_base')::numeric)/100)::int)::numeric),
(jmb.n_product->'n_price')::numeric,
round(( ( (jmb.n_product->'n_price')::numeric * (jmb.n_product->'n_vats_base')::numeric)/100)::numeric)
from journals_movements_bodies jmb
where jmb.n_doc_id = {int(doc_id)} and not jmb.n_deleted;

update journals_products_balance jpb set
n_quantity = jpb.n_quantity -
		(select (jmb.n_product->'n_amount')::bigint
		from journals_movements_bodies jmb
		where jmb.n_doc_id = {int(doc_id)} and not jmb.n_deleted
			and (jmb.n_product->'n_balance_id')::bigint=jpb.n_id
	  	),
n_dt = CURRENT_TIMESTAMP
where jpb.n_id in
	(select (n_product->'n_balance_id')::bigint
	from journals_movements_bodies
	where n_doc_id = {int(doc_id)} and not n_deleted
	);

update journals_orders_headers
set n_state = 2
where n_id::text =
	(select jmb.n_base
	 from journals_movements_headers jmb
	 where jmb.n_id = {int(doc_id)}
	);
        """
        self._print(sql)
        return self._execute(sql)


    def _hold_shipment_document(self, doc_id):
        sql = f"""insert into journals_products_movement (n_product_id, n_type, n_sign,
 										n_quantity, n_unit, n_document_id,
 										n_price_w_vats,
 										n_price_no_vats,
 										n_price_vats)
select (jsb.n_product->'n_product')::bigint, 'shipment', true,
(jsb.n_product->'n_amount')::bigint, (jsb.n_product->'n_unit')::text,
jsb.n_doc_id::bigint,
round(((jsb.n_product->'n_price')::int + (((jsb.n_product->'n_price')::numeric * (jsb.n_product->'n_vats_base')::numeric)/100)::int)::numeric),
(jsb.n_product->'n_price')::numeric,
round(( ( (jsb.n_product->'n_price')::numeric * (jsb.n_product->'n_vats_base')::numeric)/100)::numeric)
from journals_shipments_bodies jsb
where jsb.n_doc_id = {int(doc_id)} and not jsb.n_deleted;

update journals_products_balance jpb set
n_quantity = jpb.n_quantity -
		(select (jsb.n_product->'n_amount')::bigint
		from journals_shipments_bodies jsb
		where jsb.n_doc_id = {int(doc_id)} and not jsb.n_deleted
			and (jsb.n_product->'n_balance_id')::bigint=jpb.n_id
	  	),
n_dt = CURRENT_TIMESTAMP
where jpb.n_id in
	(select (n_product->'n_balance_id')::bigint
	from journals_shipments_bodies
	where n_doc_id = {int(doc_id)} and not n_deleted
	);

update journals_orders_headers
set n_state = 2
where n_id::text =
	(select jsb.n_base
	 from journals_shipments_headers jsb
	 where jsb.n_id = {int(doc_id)}
	);
        """
        self._print(sql)
        return self._execute(sql)

    def _hold_arrival_document(self, doc_id):
        sql = f"""insert into journals_products_movement (n_product_id, n_type, n_sign,
 										n_quantity, n_unit, n_document_id,
 										n_price_w_vats,
 										n_price_no_vats,
 										n_price_vats)
select (jab.n_product->'n_product')::bigint, 'arrival', true,
(jab.n_product->'n_amount')::bigint, (jab.n_product->'n_unit')::text,
jab.n_doc_id::bigint,
round(((jab.n_product->'n_price')::int + (((jab.n_product->'n_price')::numeric * (jab.n_product->'n_vats_base')::numeric)/100)::int)::numeric),
(jab.n_product->'n_price')::numeric,
round(( ( (jab.n_product->'n_price')::numeric * (jab.n_product->'n_vats_base')::numeric)/100)::numeric)
from journals_arrivals_bodies jab
where jab.n_doc_id = {int(doc_id)} and not jab.n_deleted;

insert into journals_products_balance
	(n_product_id,
	n_quantity,
	n_price,
    n_price_price,
	n_vat,
	n_consignment
	)
select
	(jab.n_product->'n_product')::bigint as n_product_id,
	(jab.n_product->'n_amount')::bigint as n_quantity,
	(jab.n_product->'n_price')::numeric as n_price,
    (jab.n_product->'n_price')::numeric as n_price,
	round(( ( (jab.n_product->'n_price')::numeric * (jab.n_product->'n_vats_base')::numeric)/100)::numeric) as n_vat,
	replace((jab.n_product->'n_consignment')::text, '"', '') as n_consignment
from journals_arrivals_bodies jab
where jab.n_doc_id = {int(doc_id)} and not jab.n_deleted
on conflict (n_product_id, n_price, n_vat, n_vat_included, n_warehouse, n_consignment)
do update
set
	n_quantity = journals_products_balance.n_quantity::int +
		(select (n_product->'n_amount')::int
			from journals_arrivals_bodies
			where n_doc_id = {int(doc_id)} and not journals_arrivals_bodies.n_deleted
 				and (n_product->'n_product')::bigint=journals_products_balance.n_product_id
		),
	n_dt = CURRENT_TIMESTAMP
where journals_products_balance.n_product_id in (select (n_product->'n_product')::bigint
from journals_arrivals_bodies
where n_doc_id = {int(doc_id)} and not n_deleted)
and journals_products_balance.n_consignment =
	(select  journals_products_balance.n_consignment
	from journals_products_balance jpb1
	where jpb1.n_id = journals_products_balance.n_id)

    returning journals_products_balance.n_id::text
        """
        return self._execute(sql)


    def _get_str(self, source):

        return source.split("\t")[-1]

    def put_order(self, *args, **kwargs):

        kwargs_ = {'document':
            {'ПРАЙС': '19.11.2020 11:56:02',
                'ИНН': '7733833655',
                'НОМЕР': '1',
                'КОММЕНТАРИЙ': ': тестовый заказ',
                'ПРИМЕЧАНИЕ': ['-1'],
                'ПРОИЗВОДИТЕЛЬ': ['None'],
                'МАТРИЦА': ['554770:'],
                'ЦЕНА': ['5.0'],
                'СУММА': '20.0',
                'ИМЯ': 'Тест',
                'ПОСТАВЩИК': '51100_тестхоз71',
                'КОЛИЧЕСТВО': ['4'],
                'ПОЗИЦИЙ': '1',
                'АДРЕС': '',
                'ФАЙЛ': 'order51100-7733833655_sin11-20324321623.txt',
                'КОД1': '1234:5678=9123:4567',
                'КОД2': ['170072::14963504'],
                'ТОВАР': ['Антистеплер'],
                'ОТПРАВКА': '19.11.2020 11:56:44',
                'ИД': '20324321623',
                'СОЗДАН': '19.11.2020 11:56:02'
            }
        }
        t = time.time()
        self._print("*"*10, " put_order ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " put_order ", "*"*10)
        doc = kwargs.get('document')
        if doc:
            doc_id = doc.get('ИД')
            doc = json.dumps(doc)
            if doc_id:
                sql = f"""insert into journals_orders_raw (n_doc_id, n_document)
                values ('{doc_id}', ('{doc}')::jsonb)"""
                self._execute(sql)

        ret = self.create_orders()
        return True


    def create_orders(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " create_orders ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " create_orders ", "*"*10)

        if self.ms_lock.tryAcquire(self._lockname, sync=True):
            sql = f"select jor.n_document, jor.n_id from journals_orders_raw jor where jor.n_adding = false"
            ret = self._execute(sql)
            t1 = time.time() - t
            if ret:
                for r in ret:
                    try:
                        row = r[0]
                        jor_id = r[1]
                        print(row)
                        n_filename = row.get('ФАЙЛ', '')
                        n_id_field = row.get('ИД')
                        n_name = row.get('ИМЯ', '')
                        n_p_id = '?'
                        n_code = row.get('КОД1') #код точки?
                        n_inn = row.get('ИНН', '')
                        n_dt_price = row.get('ПРАЙС', '')
                        n_dt_create = row.get('СОЗДАН', '')
                        n_number = row.get('НОМЕР', '')
                        n_dt_send = row.get('ОТПРАВКА', '')
                        n_pos_numbers = row.get('ПОЗИЦИЙ', 0)
                        n_summ = int(float(row.get('СУММА', 0))*100)
                        # n_recipient = 'Вологда, Окружное шоссе, 13в' #row.get('АДРЕС', '')
                        n_comment = row.get('КОММЕНТАРИЙ', '')
                        # n_recipient_id = 2032185578050000668  #ищем в базе по коду из n_code
                        # n_recipient_id = row.get('ФАЙЛ', '') #2006547488710000020 #"?"
                        sql_header = f"""insert into journals_orders_headers
    (n_state, n_supplier, n_filename,
        n_id_field, n_name,
        n_p_id, n_code, n_inn,
        n_dt_price, n_dt_create,
        n_number, n_dt_send, n_recipient,
        n_recipient_id, n_summ, n_pos_numbers,
        n_dt_recieved, n_comment)
    values (
        1, (select n_partner_id from service_home_organization), '{n_filename}',
        '{n_id_field}', '{n_name}',
        '{n_p_id}', '{n_code}', '{n_inn}',
        '{n_dt_price}'::timestamp, '{n_dt_create}'::timestamp,
        '{n_number}', '{n_dt_send}'::timestamp, (select n_name from ref_partners where n_code = '{n_code}'),
        (select n_id from ref_partners where n_code = '{n_code}'), {n_summ}, {n_pos_numbers},
        current_timestamp, '{n_comment}'
        ) returning n_id"""
                        self._print(sql_header)
                        doc_id = self._execute(sql_header)[0][0]
                        self._print(doc_id)
                        sql_all_body = []
                        for i in range(int(n_pos_numbers)):
                            row_pos = [row.get('КОД2')[i],
                                row.get('КОЛИЧЕСТВО')[i],
                                row.get('ЦЕНА')[i],
                                row.get('ТОВАР')[i],
                                row.get('ПРОИЗВОДИТЕЛЬ')[i],
                                row.get('ПРИМЕЧАНИЕ')[i],
                                row.get('МАТРИЦА')[i],
                                ]
                            sql_body = f"""insert into journals_orders_bodies (
        n_doc_id, n_product) values
        ({doc_id},
        ('{{"n_code": "{row_pos[0]}", "n_amount": {int(row_pos[1])}, "n_price": {int(float(row_pos[2])*100)},
            "n_product": "{row_pos[3].replace('"', '')}",
            "n_man": "{row_pos[4] if row_pos[4] else ''}", "n_comment": "{row_pos[5]}", "n_matrix": "{row_pos[6]}"}}')::jsonb
        );"""
                            sql_all_body.append(sql_body)
                        sql_all_body = "\n".join(sql_all_body)
                        self._print(sql_all_body)
                        self._execute(sql_all_body)
                    except:
                        import traceback
                        traceback.print_exc()
                        sql = f"""delete from journals_orders_headers where n_id = {doc_id}"""
                        self._execute(sql)
                    else:
                        sql = f"""update journals_orders_raw set n_adding = true where n_id = {jor_id}"""
                        self._execute(sql)
            t2 = time.time() - t1 - t

            self.ms_lock.release(self._lockname)
        else:
            t1 = time.time() - t
            t2 = time.time() - t1 - t

        answer = {"data": True, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def _cre_order(self, f_name):
        self._print(f_name)
        file_data = None
        with bz2.open(f_name, "r") as _f:
            file_data = _f.read().decode()
        if file_data:
            # self._print(file_data)
            file_data = file_data.splitlines()
            n_filename = self._get_str(file_data[1])
            n_id_field = self._get_str(file_data[2])
            n_name = self._get_str(file_data[3])
            n_p_id = '?'
            n_code = self._get_str(file_data[4])
            n_inn = self._get_str(file_data[5])
            n_dt_price = self._get_str(file_data[6])
            n_dt_create = self._get_str(file_data[7])
            n_number = self._get_str(file_data[8])
            n_dt_send = self._get_str(file_data[9])
            n_pos_numbers = self._get_str(file_data[10])
            n_summ = int(float(self._get_str(file_data[11]))*100)
            n_recipient = 'Тверь, Волоколамский пр-т., 13' # self._get_str(file_data[12])
            n_comment = self._get_str(file_data[13])
            n_recipient_id = 2006547488710000020 #"?"

            sql_header = f"""insert into journals_orders_headers
(n_state, n_supplier, n_filename,
	n_id_field, n_name,
	n_p_id, n_code, n_inn,
	n_dt_price, n_dt_create,
    n_number, n_dt_send, n_recipient,
	n_recipient_id, n_summ, n_pos_numbers,
    n_dt_recieved, n_comment)
values (
	1, (select n_partner_id from service_home_organization), '{n_filename}',
	'{n_id_field}', '{n_name}',
	'{n_p_id}', '{n_code}', '{n_inn}',
	'{n_dt_price}'::timestamp, '{n_dt_create}'::timestamp,
	'{n_number}', '{n_dt_send}'::timestamp, '{n_recipient}',
	'{n_recipient_id}'::bigint, {n_summ}, {n_pos_numbers},
	current_timestamp, '{n_comment}'
	) returning n_id"""
            doc_id = self._execute(sql_header)[0][0]
            self._print(doc_id)
            table = file_data[16:]
            sql = []
            for row in table:
                row = row.split("\t")
                sql_body = f"""insert into journals_orders_bodies (
n_doc_id, n_product) values
({doc_id},
('{{"n_code": "{row[0]}", "n_amount": {int(row[1])}, "n_price": {int(float(row[2])*100)},
	"n_product": "{row[3]}",
	"n_man": "{row[4] if row[4] else ''}", "n_comment": "{row[5]}", "n_matrix": "{row[6]}"}}')::jsonb
);"""
                sql.append(sql_body)
            sql = "\n".join(sql)
            # self._print(sql)
            self._execute(sql)



    def create_order_(self, file_name=None, *args, **kwargs):
        t = time.time()
        ret = ['ok',]
        self._print("*"*10, " create_order ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " create_order ", "*"*10)
        o_path = "/data/projects/sklad71/prices"
        files = [file_name, ] if file_name else glob.glob(os.path.join(o_path, 'order51100-*.bz2'))
        for f_name in files:
            self._cre_order(f_name)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def create_price(self, *args, **kwargs):
        """
        формирование прайслиста
        """
        t = time.time()
        """
        УПАКОВКА
        ОСТАТОК
        ЦЕНА РЕСТРА (как текст)
        СРОК ГОДНОСТИ
        КРАТНОСТЬ (как текст)
        МИНЗАКАЗ (как текст)
        НДС
        ID_SPR
        """
        pp = [{"51100", 0}
        ,["2020-06-26 11:07:24", "51100", [10000], "code", ["name".upper(), "", "name"], ["производитель".upper(), "", "производитель"],
            "кол-во", 99999, "", "", "", "", 0, -1]
        ,["2020-06-26 11:07:24", "51100", [10000], "code", ["name".upper(), "", "name"], ["производитель".upper(), "", "производитель"],
            "кол-во", 99999, "", "", "", "", 0, -1]
        ]
        ret = ['ok',]
        self._print("*"*10, " create_price ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " create_price ", "*"*10)
        sql = """select date_trunc('second', LOCALTIMESTAMP),
rp.c_namefull as name,
rp.c_nnt as code,
rm.c_name as manuf,
rc.c_name as country,
jpb.n_quantity as quant,
case
	when jpb.n_vat_included then jpb.n_price
	else jpb.n_price + jpb.n_vat
end as temp_price,
jpb.n_price_price as price,
coalesce(rp.c_pack, 0)::int as pack,
rv.c_vat::text as vat
from journals_products_balance jpb
join ref_products rp on (jpb.n_product_id = rp.c_id) and rp.c_inprice = true
left join ref_manufacturers rm on (rp.c_manid = rm.c_id)
left join ref_countries rc on (rp.c_mancid = rc.c_id)
left join ref_vats rv on (rv.c_id = rp.c_vatid)
where (jpb.n_price_price != 0 or jpb.n_price_price is not null) and jpb.n_consignment is not null;"""

        rows = self._request(sql) or []
        s_code = "51100"
        f = [{s_code: 0},]
        for row in rows:
            if not row[3]: row[3] = ''
            r = [
                row[0], #дата выгрузки прайса
                s_code, #код поставщика
                [row[7]], #цена, в коп
                row[2], #код товара
                [row[1].upper(), "", row[1]], #наименование
                [row[3].upper(), "", row[3]], #производитель
                f"{row[8] if row[8] else ''}", #упаковка
                row[5], #остаток
                "", #?
                "", #?
                "", #f"{row[8]}", #?
                "", #f"{row[8]}", #?
                row[9], #НДС
                -1 #?
            ]
            f.append(r)
        # bz_name = f"/ms71/data/new_sklad_prices/{s_code}.bz2"
        bz_name = os.path.join(self.temp_dir, f'{s_code}.bz2')
        if f:
            with bz2.open(bz_name, "w") as _f:
                data = "[%s\n]" % "\n,".join([json.dumps(e, ensure_ascii=False) for e in f])
                _f.write(data.encode())
        if os.path.exists(bz_name):
            # r = subprocess.call(f's3cmd -c /root/.s3cmd put {bz_name} s3://ms71.offer/prices/r71/', shell=True)
            cmd = ["s3cmd", "-c", "/root/s3cfg", "put", bz_name, "s3://ms71.offer/prices/r71/"]
            # r = subprocess.call(cmd)
            r = subprocess.call(f's3cmd put {bz_name} s3://ms71.offer/prices/r71/', shell=True)
        # r = subprocess.call('s3cmd ls', shell=True)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def get_login(self, *args, **kwargs):
        """
        запрос на аутентификацию
        """
        t = time.time()
        self._print("*"*10, " get_login ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_login ", "*"*10)
        user = kwargs.get('user', '')
        pwd = kwargs.get('user', 'pwd')
        ret = []
        row = ['belyaev', '0123456789somehashtotal32symbols']

        sql = f"""select n_sklad_name, n_pwd from
ref_employees
where n_sklad_name = '{user}'"""
        resp = self._request(sql)
        self._print(resp)
        if resp:
            if resp[0][0] != user.lower():
                answer = {"data": [], "params": args, "kwargs": kwargs, "reason": "user incorrect"}
            elif resp[0][1] != pwd:
                answer = {"data": [], "params": args, "kwargs": kwargs, "reason": "pwd incorrect"}
            answer = {"data":
                [{
                    "n_sklad_name": str(resp[0][0]),
                    "n_hash": row[1],},
                ],
                "params": args, "kwargs": kwargs}
        else:
            answer = {"data": [], "params": args, "kwargs": kwargs, "reason": "user incorrect"}

        return answer

    def get_credentionals(self, *args, **kwargs):
        """
        запрос прав пользователя
        """
        t = time.time()
        self._print("*"*10, " get_credentionals ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_credentionals ", "*"*10)
        user = kwargs.get('user', '')
        ret = []
        sql = f"""select re.n_id, re.n_name, re.n_params, re.n_sklad_name, sho.n_partner_id, rp.n_name  from
ref_employees re, service_home_organization sho
join ref_partners rp ON rp.n_id = sho.n_partner_id
where re.n_sklad_name = '{user}'"""
        for row in self._request(sql):
            r = {
                "n_id": str(row[0]),
                "n_name": row[1],
                "n_params": row[2],
                "n_home_id": str(row[4]),
                "n_home_name": row[5]
            }
            ret.append(r)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def delete_document(self, *args, **kwargs):
        """
        удаление документа
        """
        t = time.time()
        self._print("*"*10, " delete_document ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " delete_document ", "*"*10)
        filters = kwargs.get('filters')
        ret = []
        if filters:
            doc_type = filters.get('doc_type')
            doc_id = filters.get('doc_id')
            try:
                doc_type = doc_type.split()[0]
                doc_id = int(doc_id)
            except:
                pass
            else:
                if doc_id and doc_type:
                    self._execute(f"""update journals_{doc_type}s_headers set n_state = 3::bigint where n_id={doc_id}""")
                    method = getattr(self, f'_get_{doc_type}_header')
                    ret = method(doc_id)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def undelete_document(self, *args, **kwargs):
        """
        удаление документа
        """
        t = time.time()
        self._print("*"*10, " undelete_document ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " undelete_document ", "*"*10)
        filters = kwargs.get('filters')
        ret = []
        if filters:
            doc_type = filters.get('doc_type')
            doc_id = filters.get('doc_id')
            try:
                doc_type = doc_type.split()[0]
                doc_id = int(doc_id)
            except:
                pass
            else:
                if doc_id and doc_type:
                    self._execute(f"""update journals_{doc_type}s_headers set n_state = 1::bigint where n_id={doc_id};""")
                    method = getattr(self, f'_get_{doc_type}_header')
                    ret = method(doc_id)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def hold_document(self, *args, **kwargs):
        """
        проведение документа
        """
        t = time.time()
        self._print("*"*10, " hold_document ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " hold_document ", "*"*10)
        filters = kwargs.get('filters')
        ret = []
        ret1 = []
        if filters:
            doc_type = filters.get('doc_type')
            doc_id = filters.get('doc_id')
            if doc_id and doc_type:
                #делаем записи движения всех товаров для документа
                #пересчитываем количество в текущих остатках
                method = getattr(self, f'_hold_{doc_type}_document')
                ret1 = method(doc_id)
                self._print(ret1)
                if doc_type == 'arrival':
                    self._execute(f"""update journals_arrivals_headers set n_state = 2::bigint where n_id={int(doc_id)}""")
                elif doc_type == 'movement':
                    self._execute(f"""update journals_movements_headers set n_state = 2::bigint where n_id={int(doc_id)}""")
                elif doc_type == 'rest':
                    self._execute(f"""update journals_rests_headers set n_state = 2::bigint where n_id={int(doc_id)}""")
                elif doc_type == 'transfer':
                    pass
                elif doc_type == 'shipment':
                    self._execute(f"""update journals_shipments_headers set n_state = 2::bigint where n_id={int(doc_id)}""")
                method = getattr(self, f'_get_{doc_type}_header')
                ret = method(doc_id)
                self._print(ret)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "data1": ret1, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        self._print(answer)
        return answer

    def unhold_document(self, *args, **kwargs):
        """
        отмена проведения документа
        """
        t = time.time()
        self._print("*"*10, " unhold_document ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " unhold_document ", "*"*10)
        filters = kwargs.get('filters')
        ret = []
        if filters:
            doc_type = filters.get('doc_type')
            doc_id = filters.get('doc_id')
            if doc_id and doc_type:
                # проверяем был ли расход, если не было - удаляем записи движения всех товаров для документа
                # пересчитываем количество в текущих остатках
                if doc_type == 'arrival':
                    self._execute(f"""update journals_products_balance
set
	n_quantity = journals_products_balance.n_quantity::int -
		(select (n_product->'n_amount')::int
			from journals_arrivals_bodies
			where n_doc_id = {int(doc_id)} and not journals_arrivals_bodies.n_deleted
 				and (n_product->'n_product')::bigint=journals_products_balance.n_product_id
		 		and (n_product->'n_price')::int = journals_products_balance.n_price
		),
	n_dt = CURRENT_TIMESTAMP
where journals_products_balance.n_product_id in (
	select (n_product->'n_product')::bigint
	from journals_arrivals_bodies
	where n_doc_id = {int(doc_id)} and not n_deleted
		and (n_product->'n_price')::int = journals_products_balance.n_price
	)
	and journals_products_balance.n_consignment =(
		select  journals_products_balance.n_consignment
		from journals_products_balance jpb1
		where jpb1.n_id = journals_products_balance.n_id
	);

update journals_products_movement jpm
set n_deleted = true
where jpm.n_document_id = {int(doc_id)};

update journals_arrivals_headers set n_state = 1::bigint where n_id={int(doc_id)}

    """)
                    # self._execute(f"""update journals_arrivals_headers set n_state = 1::bigint where n_id={int(doc_id)}""")
                elif doc_type == 'rest':
                    self._execute(f"""update journals_products_balance
set
	n_quantity = journals_products_balance.n_quantity::int -
		(select (n_product->'n_amount')::int
			from journals_rests_bodies
			where n_doc_id = {int(doc_id)} and not journals_rests_bodies.n_deleted
 				and (n_product->'n_product')::bigint=journals_products_balance.n_product_id
		),
	n_dt = CURRENT_TIMESTAMP
where journals_products_balance.n_product_id in (select (n_product->'n_product')::bigint
from journals_rests_bodies
where n_doc_id = {int(doc_id)} and not n_deleted)
and journals_products_balance.n_consignment =
	(select  journals_products_balance.n_consignment
	from journals_products_balance jpb1
	where jpb1.n_id = journals_products_balance.n_id);

update journals_products_movement jpm
set n_deleted = true
where jpm.n_document_id = {int(doc_id)};

update journals_rests_headers set n_state = 1::bigint where n_id={int(doc_id)};

""")
                elif doc_type == 'movement':
                    self._execute(f"""update journals_products_balance jpb set
n_quantity = jpb.n_quantity +
		(select (jmb.n_product->'n_amount')::bigint
		from journals_movements_bodies jmb
		where jmb.n_doc_id = {int(doc_id)} and not jmb.n_deleted
			and (jmb.n_product->'n_balance_id')::bigint=jpb.n_id
	  	),
n_dt = CURRENT_TIMESTAMP
where jpb.n_id in
	(select (n_product->'n_balance_id')::bigint
	from journals_movements_bodies
	where n_doc_id = {int(doc_id)} and not n_deleted
	);

update journals_products_movement jpm
set n_deleted = true
where jpm.n_document_id = {int(doc_id)};
update journals_movements_headers set n_state = 1::bigint where n_id={int(doc_id)}; """)
                    pass
                elif doc_type == 'transfer':
                    pass
                elif doc_type == 'shipment':
                    self._execute(f"""update journals_products_balance jpb set
n_quantity = jpb.n_quantity +
		(select (jsb.n_product->'n_amount')::bigint
		from journals_shipments_bodies jsb
		where jsb.n_doc_id = {int(doc_id)} and not jsb.n_deleted
			and (jsb.n_product->'n_balance_id')::bigint=jpb.n_id
	  	),
n_dt = CURRENT_TIMESTAMP
where jpb.n_id in
	(select (n_product->'n_balance_id')::bigint
	from journals_shipments_bodies
	where n_doc_id = {int(doc_id)} and not n_deleted
	);

update journals_products_movement jpm
set n_deleted = true
where jpm.n_document_id = {int(doc_id)};
update journals_shipments_headers set n_state = 1::bigint where n_id={int(doc_id)}; """)
                    pass

                method = getattr(self, f'_get_{doc_type}_header')
                ret = method(doc_id)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def _set_where_ref_sel(self, params=None):
        inserts = []
        if params:
            # self._print(params)
            n_name = params.get('n_name')
            if n_name:
                r = f"""lower(r.n_name) like lower('%{n_name}%')"""
                inserts.append(r)
        where = 'where '+' and '.join(inserts) if inserts else ''
        return where

    def _set_where_prod_sel(self, params=None):
        inserts = []
        if params:
            # self._print(params)
            c_name = params.get('c_name')
            if c_name:
                r = f"""lower(rp.c_name) like lower('%{c_name}%')"""
                inserts.append(r)
        where = 'where '+' and '.join(inserts) if inserts else ''
        return where

    def save_point(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " save_point ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " save_point ", "*"*10)
        data = kwargs.get('doc_data')
        if data:
            n_address = data.get("n_address", "")
            n_comment = data.get("n_comment", "")
            n_contact = data.get("n_contact", "")
            n_email = data.get("n_email", "")
            n_id = data.get("n_id")
            n_name = data.get("n_name")
            n_parent = data.get("n_parent_id")
            n_phone = data.get("n_phone", "")
            n_code = data.get("n_code", "")

            if n_name:
                if n_id:
                    sql = f"""update ref_partners set (
    n_name, n_address, n_contact,
    n_phone, n_email, n_comment,
    n_parent_id, n_code
) = (
    '{n_name}'::text, '{n_address}'::text, '{n_contact}'::text,
    '{n_phone}'::text, '{n_email}'::text, '{n_comment}'::text,
    {n_parent}::bigint, '{n_code}'::text
) where n_id = {n_id}::bigint
returning n_id;
                """
                else:
                    sql = f"""insert into ref_partners (
    n_name, n_address, n_contact,
    n_phone, n_email, n_comment,
    n_parent_id, n_type, n_code
) values (
    '{n_name}'::text, '{n_address}'::text, '{n_contact}'::text,
    '{n_phone}'::text, '{n_email}'::text, '{n_comment}'::text,
    {n_parent}::bigint, 2019024587420000001, '{n_code}'::text
)
returning n_id;
        """
        else:
            pass
            #error names
        self._print(sql)
        ret = self._get_point(self._execute(sql)[0][0])
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer

    def get_point(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_point ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_point ", "*"*10)
        p_id = kwargs.get('p_id')
        ret = []

        ret = self._get_point(p_id)

        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer

    def _get_point(self, point_id):
        ret = []
        sql = f"""select
    rp.n_id, rp.n_name, rp.n_address, rp.n_contact,
    rp.n_phone, rp.n_email, rp.n_comment,
    rp.n_parent_id, rp1.n_name, rp.n_code
from ref_partners rp
left join ref_partners rp1 on (rp1.n_id = rp.n_parent_id)
where rp.n_id = {point_id}::bigint;
        """
        self._print(sql)
        resp = self._request(sql)
        for row in resp:
            r = {"id":  str(row[0]),
                "n_id": str(row[0]),
                "n_name": row[1],
                "n_address": row[2] or "",
                "n_contact": row[3] or "",
                "n_phone": row[4] or "",
                "n_email": row[5] or "",
                "n_comment": row[6] or "",
                "n_parent_id": str(row[7]),
                "n_parent": row[8] or "",
                "n_code": row[9] or ""
            }
            ret.append(r)
        return ret

    def _save_main_point(self, parent_id):
        sql = f"""insert into ref_partners (
    n_name, n_address, n_contact,
    n_phone, n_email, n_comment,
    n_parent_id, n_type
) values (
    (select n_name || ' основное подразделение' from ref_partners where n_id = {parent_id}),
    (select n_actual_address from ref_partners where n_id = {parent_id}),
    (select n_contact from ref_partners where n_id = {parent_id}),
    (select n_phone from ref_partners where n_id = {parent_id}),
    (select n_email from ref_partners where n_id = {parent_id}),
    (select n_comment from ref_partners where n_id = {parent_id}),
    {parent_id}::bigint, 2019024587420000001
)
returning n_id;
        """
        point = self._execute(sql)
        return point


    def save_partner(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " save_partner ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " save_partner ", "*"*10)
        data = kwargs.get('doc_data')
        if data:
            n_actual_address = data.get("n_actual_address", "")
            n_address = data.get("n_address", "")
            n_bank_bik = data.get("n_bank_bik", "")
            n_bank_ch_account =data.get("n_bank_ch_account", "")
            n_bank_k_account = data.get("n_bank_k_account", "")
            n_bank_name = data.get("n_bank_name", "")
            n_comment = data.get("n_comment", "")
            n_contact = data.get("n_contact", "")
            n_email = data.get("n_email", "")
            n_id = data.get("n_id")
            n_inn = data.get("n_inn", "")
            n_kpp = data.get("n_kpp", "")
            n_name = data.get("n_name")
            n_namefull = data.get("n_namefull")
            n_ogrn = data.get("n_ogrn", "")
            n_phone = data.get("n_phone", "")
            n_type = data.get("n_type")

            if n_id:
                sql = f"""update ref_partners set (
    n_name, n_type, n_namefull,
    n_inn, n_kpp, n_ogrn,
    n_address, n_actual_address, n_contact,
    n_phone, n_email, n_bank_bik,
    n_bank_ch_account, n_bank_k_account, n_bank_name,
    n_comment
) = (
    '{n_name}'::text, { "'%s'::bigint" % n_type if n_type else "null"}, '{n_namefull}'::text,
    '{n_inn}'::text, '{n_kpp}'::text, '{n_ogrn}'::text,
    '{n_address}'::text, '{n_actual_address}'::text, '{n_contact}'::text,
    '{n_phone}'::text, '{n_email}'::text, '{n_bank_bik}'::text,
    '{n_bank_ch_account}'::text, '{n_bank_k_account}'::text, '{n_bank_name}'::text,
    '{n_comment}'::text
) where n_id = {n_id}::bigint
returning n_id;
            """
            else:
                sql = f"""insert into ref_partners (
    n_name, n_type, n_namefull,
    n_inn, n_kpp, n_ogrn,
    n_address, n_actual_address, n_contact,
    n_phone, n_email, n_bank_bik,
    n_bank_ch_account, n_bank_k_account, n_bank_name,
    n_comment
) values (
    '{n_name}'::text, { "'%s'::bigint" % n_type if n_type else "null"}, '{n_namefull}'::text,
    '{n_inn}'::text, '{n_kpp}'::text, '{n_ogrn}'::text,
    '{n_address}'::text, '{n_actual_address}'::text, '{n_contact}'::text,
    '{n_phone}'::text, '{n_email}'::text, '{n_bank_bik}'::text,
    '{n_bank_ch_account}'::text, '{n_bank_k_account}'::text, '{n_bank_name}'::text,
    '{n_comment}'::text
)
returning n_id;
        """

        self._print(sql)
        partner_id = self._execute(sql)[0][0]
        if not n_id:
            r = self._save_main_point(partner_id)
        ret = self._get_partner(partner_id)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer

    def get_partner(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_partner ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_partner ", "*"*10)
        p_id = kwargs.get('p_id')
        ret = []

        ret = self._get_partner(p_id)

        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer


    def _get_partner(self, partner_id):
        ret = []
        sql = f"""select
rp.n_id, rp.n_name, rp.n_type, rp.n_namefull,
rp.n_inn, rp.n_kpp, rp.n_ogrn,
rp.n_address, rp.n_actual_address, rp.n_contact,
rp.n_phone, rp.n_email, rp.n_bank_bik,
rp.n_bank_ch_account, rp.n_bank_k_account, rp.n_bank_name,
rp.n_comment, rpt.n_name
from ref_partners rp
left join ref_partners_types rpt ON rpt.n_id = rp.n_type
where rp.n_id = {partner_id}::bigint;
        """
        self._print(sql)
        resp = self._request(sql)
        for row in resp:
            r = {"id": str(row[0]),
                "n_id": str(row[0]),
                "n_name": row[1],
                "n_type": str(row[2]) or "",
                "n_namefull": row[3],
                "n_inn": row[4] or "",
                "n_kpp": row[5] or "",
                "n_ogrn": row[6] or "",
                "n_address": row[7] or "",
                "n_actual_address": row[8] or "",
                "n_contact": row[9] or "",
                "n_phone": row[10] or "",
                "n_email": row[11] or "",
                "n_bank_bik": row[12] or "",
                "n_bank_ch_account": row[13] or "",
                "n_bank_k_account": row[14] or "",
                "n_bank_name": row[15] or "",
                "n_comment": row[16] or "",
                "n_type_text": row[17] or ""
            }
            ret.append(r)
        return ret

    def save_product(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " save_product ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " save_product ", "*"*10)
        data = kwargs.get('doc_data')
        if data:
            k = data.keys()
            for row in k:
                self._print(row, str(data[row]).strip())
                if not str(data[row]).strip():
                    data[row] = 'null'
                self._print(row, str(data[row]).strip())
            c_aaid = data.get('c_aaid',)
            c_catid = data.get('c_catid')
            c_dirid = data.get('c_dirid')
            c_doseid = data.get('c_doseid')
            c_doseval = data.get('c_doseval')
            c_gpid = data.get('c_gpid')
            c_gvnls = data.get('c_gvnls')
            c_mancid = data.get('c_mancid')
            c_manid = data.get('c_manid')
            c_megaid = data.get('c_megaid')
            c_mnnid = data.get('c_mnnid')
            c_name = data.get('c_name')
            c_namefull = data.get('c_namefull')
            c_nnt = data.get('c_nnt')
            c_pack = data.get('c_pack')
            c_ppid = data.get('c_ppid')
            c_psid = data.get('c_psid')
            c_ptid = data.get('c_ptid')
            c_rfid = data.get('c_rfid')
            c_speid = data.get('c_speid')
            c_type = data.get('c_type')
            c_vatid = data.get('c_vatid')
            # params = [
            #     data.get('c_aaid'), data.get('c_catid'), data.get('c_dirid'), data.get('c_doseid'),
            #     data.get('c_doseval'), data.get('c_gpid'), True if data.get('c_gvnls') == '1' else False, data.get('c_mancid'),
            #     data.get('c_manid'), data.get('c_megaid'), data.get('c_mnnid'), data.get('c_name'),
            #     data.get('c_namefull'), data.get('c_nnt'), data.get('c_pack'), data.get('c_ppid'),
            #     data.get('c_psid'), data.get('c_ptid'), data.get('c_rfid'), data.get('c_speid'),
            #     data.get('c_type'), data.get('c_vatid')
            # ]
            if data["c_id"] != 'null':
                sql = f"""update ref_products set (
    c_aaid, c_catid, c_dirid,c_doseid,
    c_doseval, c_gpid, c_gvnls, c_mancid,
    c_manid, c_megaid, c_mnnid, c_name,
    c_namefull, c_nnt, c_pack, c_ppid,
    c_psid, c_ptid, c_rfid, c_speid,
    c_type, c_vatid
) = (
    {c_aaid}::bigint, {c_catid}::bigint, {c_dirid}::bigint, {c_doseid}::bigint,
    {c_doseval}::numeric, {c_gpid}::bigint, {'true' if c_gvnls == 1 else 'false'}::boolean, {c_mancid}::bigint,
    {c_manid}::bigint, {c_megaid}::bigint, {c_mnnid}::bigint, '{c_name}'::text,
    '{c_namefull}'::text, '{c_nnt}'::text, {c_pack}::numeric, {c_ppid}::bigint,
    {c_psid}::bigint, {c_ptid}::bigint, {c_rfid}::bigint, {c_speid}::bigint,
    {c_type}, {c_vatid}::bigint
)
where c_id = {int(data["c_id"])}
returning c_id;
"""
            else:
                sql = f"""insert into ref_products (
    c_aaid, c_catid, c_dirid,c_doseid,
    c_doseval, c_gpid, c_gvnls, c_mancid,
    c_manid, c_megaid, c_mnnid, c_name,
    c_namefull, c_nnt, c_pack, c_ppid,
    c_psid, c_ptid, c_rfid, c_speid,
    c_type, c_vatid
) values (
    {c_aaid}::bigint, {c_catid}::bigint, {c_dirid}::bigint, {c_doseid}::bigint,
    {c_doseval}::numeric, {c_gpid}::bigint, {'true' if c_gvnls == 1 else 'false'}::boolean, {c_mancid}::bigint,
    {c_manid}::bigint, {c_megaid}::bigint, {c_mnnid}::bigint, '{c_name}'::text,
    '{c_namefull}'::text, '{c_nnt}'::text, {c_pack}::numeric, {c_ppid}::bigint,
    {c_psid}::bigint, {c_ptid}::bigint, {c_rfid}::bigint, {c_speid}::bigint,
    {c_type}, {c_vatid}::bigint
)
returning c_id
"""
        self._print(sql)
        ret = self._get_product(self._execute(sql)[0][0])
        self._print(ret)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer

    def _get_product(self, p_id):
        ret = []
        if p_id:
            #get data from table
            sql = f"""select c_aaid,
    c_catid,
    c_dirid,
    c_doseid,
    c_doseval,
    c_gpid,
    case
    when c_gvnls then 1
    else 2
    end,
    c_mancid,
    c_manid,
    c_megaid,
    c_mnnid,
    c_name,
    c_namefull,
    c_nnt,
    c_pack::int,
    c_ppid,
    c_psid,
    c_ptid,
    c_rfid,
    c_speid,
    coalesce(c_type, '2'),
    c_vatid,
    c_id,
    c_inprice
    from ref_products
    where c_id = '{int(p_id)}';
    """
            # print(sql)
            rows =  self._execute(sql)
            for row in rows:
                r = {
                    "c_aaid": str(row[0] or ""),
                    "c_catid": str(row[1] or ""),
                    "c_dirid": str(row[2] or ""),
                    "c_doseid": str(row[3] or ""),
                    "c_doseval": str(row[4] or ""),
                    "c_gpid": str(row[5] or ""),
                    "c_gvnls": str(row[6] or ""),
                    "c_mancid": str(row[7] or ""),
                    "c_manid": str(row[8] or ""),
                    "c_megaid": str(row[9] or ""),
                    "c_mnnid": str(row[10] or ""),
                    "c_name": str(row[11] or ""),
                    "c_namefull": str(row[12] or ""),
                    "c_nnt": str(row[13] or ""),
                    "c_code": str(row[13] or ""),
                    "c_pack": str(row[14] or ""),
                    "c_ppid": str(row[15] or ""),
                    "c_psid": str(row[16] or ""),
                    "c_ptid": str(row[17] or ""),
                    "c_rfid": str(row[18] or ""),
                    "c_speid": str(row[19] or ""),
                    "c_type": str(row[20] or ""),
                    "c_vatid": str(row[21] or ""),
                    "c_id": str(row[22] or ""),
                    "c_inprice": row[23]
                }
                ret.append(r)
        else:
            r = {
                #default empty data
                "c_aaid": "",
                "c_catid": "",
                "c_dirid": "",
                "c_doseid": "",
                "c_doseval": "",
                "c_gpid": "",
                "c_gvnls": "2",
                "c_mancid": "",
                "c_manid": "",
                "c_megaid": "",
                "c_mnnid": "",
                "c_name": "",
                "c_namefull": "",
                "c_nnt": "",
                "c_pack": "",
                "c_ppid": "",
                "c_psid": "",
                "c_ptid": "",
                "c_rfid": "",
                "c_speid": "",
                "c_type": "2",
                "c_vatid": "2006552811470000003",
                "c_inprice": True
            }
            ret.append(r)

        return ret

    def _get_ref_element(self, p_id, reference):
        t = time.time()
        self._print("*"*10, " _get_ref_element ", "*"*10)
        ret = []
        if reference in ["partners", "ptypes", "employees"]:
            pref = 'n'
        else:
            pref = 'c'
        where = f"""where  r.{pref}_id = {p_id}::bigint"""

        if reference == 'partners':
            rows = []
            sql = f"""select r.n_id, r.n_name, r.n_type, rpt.n_name
from ref_{reference} r
left join ref_{reference}_types rpt on (r.n_type = rpt.n_id)
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                    "n_type": str(row[2]),
                    "n_type_name": row[3]
                }
                ret.append(r)

        elif reference == "vats":
            rows = []
            sql = f"""select r.c_id, r.c_name, r.c_vat
from ref_{reference} r
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_vat": str(row[2]),
                }
                ret.append(r)

        elif reference == "spes":
            rows = []
            sql = f"""select r.c_id, r.c_name, r.c_catid, rc.c_name
from ref_spes r
left join ref_categories rc on (r.c_catid = rc.c_id)
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_cat": str(row[2]),
                    "c_cat_name": str(row[3]),
                }
                ret.append(r)
        elif reference == "categories":
            rows = []
            sql = f"""select r.c_id, r.c_name, r.c_dirid, , rd.c_name
from ref_{reference} r
left join ref_directions rd on (r.c_dirid = rd.c_id)
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_dir": str(row[2]),
                    "c_dir_name": str(row[3]),
                }
                ret.append(r)
        elif reference == "appareas":
            rows = []
            sql = f"""select r.c_id, r.c_name, r.c_parentid, rd.c_name
from ref_application_areas r
left join ref_application_areas rd on (r.c_parentid = rd.c_id)
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_parent": str(row[2]),
                    "c_parent_name": str(row[3]),
                }
                ret.append(r)
        elif reference == "groups":
            rows = []
            sql = f"""select r.c_id, r.c_name, r.c_parentid, ra.c_name
from ref_groups r
left join ref_groups ra on (r.c_parentid = ra.c_id)
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_parent": str(row[2]),
                    "c_parent_name": str(row[3]),
                }
                ret.append(r)
        elif reference == "relforms":
            rows = []
            sql = f"""select r.c_id, r.c_name
from ref_release_forms r
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                }
                ret.append(r)
        elif reference == "ptypes":
            rows = []
            sql = f"""select r.n_id, r.n_name
from ref_partners_types r
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                }
                ret.append(r)

        elif reference == "mnns":
            rows = []
            sql = f"""select r.c_id, r.c_rusname, r.c_latname, r.c_engname
from ref_{reference} r
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_rusname": row[1],
                    "c_latname": row[2],
                    "c_engname": row[3],
                }
                ret.append(r)

        elif reference == "employees":
            rows = []
            sql = f"""select r.n_id, r.n_name
from ref_{reference} r
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                }
                ret.append(r)

        elif reference in ["trademarks", "packagings", "megacategories", "manufacturers",
            "directions", "dosages", "countries"]:
            rows = []
            sql = f"""select r.c_id, r.c_name
from ref_{reference} r
"""
            sql += where
            rows = self._request(sql) or []
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                }
                ret.append(r)

        return ret


    def get_ref_element(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_ref_element ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_ref_element ", "*"*10)
        p_id = kwargs.get('p_id')
        reference = kwargs.get('reference')
        ret = []
        ret = self._get_ref_element(p_id, reference)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer

    def save_ref_element(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " save_ref_element ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " save_ref_element ", "*"*10)
        data = kwargs.get('doc_data')
        reference = kwargs.get('reference')
        ret = []
        ref_id = data.get('id')
        if reference == 'partners':
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (n_name, n_type)
values ('{data['n_name']}'::text, {data['n_type']}::bigint)
returning n_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (n_name, n_type)
= ('{data['n_name']}'::text, {data['n_type']}::bigint)
where n_id = {data['n_id']}::bigint
returning n_id"""

        elif reference == "vats":
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (c_name, c_vat)
values ('{data['c_name']}'::text, {data['c_vat']}::bigint)
returning c_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (c_name, c_vat)
= ('{data['c_name']}'::text, {data['c_vat']}::bigint)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "spes":
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (c_name, c_catid)
values ('{data['c_name']}'::text, {data['c_catid']}::bigint)
returning c_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (c_name, c_catid)
= ('{data['c_name']}'::text, {data['c_catid']}::bigint)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "categories":
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (c_name, c_dirid)
values ('{data['c_name']}'::text, {data['c_dirid']}::bigint)
returning c_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (c_name, c_dirid)
= ('{data['c_name']}'::text, {data['c_dirid']}::bigint)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "appareas":
            if not ref_id:
                #insert
                sql = f"""insert into ref_application_areas (c_name, c_parentid)
values ('{data['c_name']}'::text, {data['c_parentid']}::bigint)
returning c_id"""
            else:
                #update
                sql = f"""update ref_application_areas set (c_name, c_parentid)
= ('{data['c_name']}'::text, {data['c_parentid']}::bigint)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "groups":
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (c_name, c_parentid)
values ('{data['c_name']}'::text, {data['c_parentid']}::bigint)
returning c_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (c_name, c_parentid)
= ('{data['c_name']}'::text, {data['c_parentid']}::bigint)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "relforms":
            if not ref_id:
                #insert
                sql = f"""insert into ref_release_forms (c_name)
values ('{data['c_name']}'::text)
returning c_id"""
            else:
                #update
                sql = f"""update ref_release_forms set (c_name)
= ('{data['c_name']}'::text)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "ptypes":
            if not ref_id:
                #insert
                sql = f"""insert into ref_partners_types (c_name)
values ('{data['c_name']}'::text)
returning c_id"""
            else:
                #update
                sql = f"""update ref_partners_types set (c_name)
= ('{data['c_name']}'::text)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "mnns":
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (c_rusname, c_latname, c_engname)
values ('{data['c_name']}'::text, '{data['c_latname']}'::text, '{data['c_engname']}'::text)
returning c_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (c_rusname, c_latname, c_engname)
= ('{data['c_name']}'::text, '{data['c_latname']}'::text, '{data['c_engname']}'::text)
where c_id = {data['c_id']}::bigint
returning c_id"""

        elif reference == "employees":
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (n_name)
values ('{data['n_name']}'::text)
returning n_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (n_name)
= ('{data['n_name']}'::text)
where c_id = {data['n_id']}::bigint
returning n_id"""

        elif reference in ["trademarks", "packagings", "megacategories", "manufacturers",
            "directions", "dosages", "countries"]:
            if not ref_id:
                #insert
                sql = f"""insert into ref_{reference} (c_name)
values ('{data['c_name']}'::text)
returning c_id"""
            else:
                #update
                sql = f"""update ref_{reference} set (c_name)
= ('{data['c_name']}'::text)
where c_id = {data['c_id']}::bigint
returning c_id"""

        else:
            sql = "select 2"

        self._print(sql)
        ret = self._get_ref_element(self._execute(sql)[0][0], reference)
        self._print(ret)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer


    def get_product(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_product ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_product ", "*"*10)
        p_id = kwargs.get('p_id')
        ret = []

        ret = self._get_product(p_id)

        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
        }
        return answer

    def get_products_index(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_products_index ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_products_index ", "*"*10)
        filters = kwargs.get('filters')
        pos_id = filters.get('production_id')
        try:
            field = filters['sort']['id']
            direction = filters['sort']['dir']
        except:
            field = 'c_name'
            direction = 'asc'
        sql = f"""select q.num
from
(select  row_number() OVER(order by {field} {direction}) as num, c_id as cid
    from ref_products) as q
where q.cid = {pos_id}::bigint;
"""
        self._print(sql)
        rows = self._request(sql) or []
        t1 = time.time() - t
        ret = []
        for row in rows:
            r = {
                "index": row[0]
            }
            ret.append(r)
        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
                  }
        return answer

    def _create_ref_sql(self, filters):
        ret = []
        reference = filters['filters']['reference']
        offset = filters.get('start', 0)
        count = filters.get('count', 17)
        try:
            field = filters['sort']['id']
            direction = filters['sort']['dir']
        except:
            # traceback.print_exc()
            self._print("exception")
            field = 'c_name'
            direction = 'asc'
        if reference in ["partners", "points", "ptypes", "employees"] and field == 'c_name':
            field = 'n_name'
        where = self._set_where_ref_sel(filters.get('filters'))
        order = f"""\norder by r.{field} {direction} \n"""
        limits = f"""limit {count} offset {offset}"""

        self._print(reference)

        if reference == 'partners':
            rows = []
            sql = f"""select r.n_id, r.n_name, rpt.n_name, r.n_inn,
(select count(*) as cou from ref_partners rp1 where r.n_id = rp1.n_parent_id)
from ref_partners r
join ref_partners_types rpt on (r.n_type = rpt.n_id and rpt.n_name != 'Точка')
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                    "n_type_text": row[2],
                    "n_inn": row[3],
                    "n_points": row[4] if row[4] else 'Нет'
                }
                ret.append(r)
        elif reference == 'points':
            rows = []
            sql = f"""select r.n_id, r.n_name, rp1.n_name, rp1.n_id, r.n_address
from ref_partners r
join ref_partners_types rpt on (r.n_type = rpt.n_id and rpt.n_name = 'Точка')
join ref_partners rp1 on (rp1.n_id=r.n_parent_id)
"""

            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            self._print(sql)
            self._print(sql_count)
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                    "n_parent": row[2],
                    "n_parent_id": str(row[3]),
                    "n_address": row[4]
                }
                ret.append(r)
        elif reference == "vats":
            rows = []
            sql = f"""select r.c_id, r.c_name, r.c_vat
from ref_{reference} r
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_vat": row[2],
                }
                ret.append(r)
        elif reference == "spes":
            rows = []
            sql = f"""select r.c_id, r.c_name, rc.c_name
from ref_spes r
left join ref_categories rc on (r.c_catid = rc.c_id)
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_cat": row[2],
                }
                ret.append(r)
        elif reference == "categories":
            rows = []
            sql = f"""select r.c_id, r.c_name, rd.c_name
from ref_{reference} r
left join ref_directions rd on (r.c_dirid = rd.c_id)
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_dir": row[2],
                }
                ret.append(r)
        elif reference == "appareas":
            rows = []
            sql = f"""select r.c_id, r.c_name, rd.c_name
from ref_application_areas r
left join ref_application_areas rd on (r.c_parentid = rd.c_id)
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_parent": row[2],
                }
                ret.append(r)
        elif reference == "groups":
            rows = []
            sql = f"""select r.c_id, r.c_name, ra.c_name
from ref_groups r
left join ref_groups ra on (r.c_parentid = ra.c_id)
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                    "c_parent": row[2],
                }
                ret.append(r)
        elif reference == "relforms":
            rows = []
            sql = f"""select r.c_id, r.c_name
from ref_release_forms r
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                }
                ret.append(r)
        elif reference == "ptypes":
            rows = []
            sql = f"""select r.n_id, r.n_name
from ref_partners_types r
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                }
                ret.append(r)

        elif reference == "mnns":
            rows = []
            sql = f"""select r.c_id, r.c_rusname, r.c_latname, r.c_engname
from ref_{reference} r
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_rusname": row[1],
                    "c_latname": row[2],
                    "c_engname": row[3],
                }
                ret.append(r)

        elif reference == "employees":
            rows = []
            sql = f"""select r.n_id, r.n_name
from ref_{reference} r
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "n_id": str(row[0]),
                    "n_name": row[1],
                }
                ret.append(r)

        elif reference in ["trademarks", "packagings", "megacategories", "manufacturers",
            "directions", "dosages", "countries"]:
            rows = []
            sql = f"""select r.c_id, r.c_name
from ref_{reference} r
"""
            sql_count = f"""select count(*) from ({sql+where}) as ccc"""
            sql += where + order + limits
            self._print(sql)
            rows = self._request(sql) or []
            cou = self._request(sql_count)
            if cou:
                cou = cou[0][0]
            else:
                cou = 0
            for row in rows:
                r = {
                    "id": str(row[0]),
                    "c_id": str(row[0]),
                    "c_name": row[1],
                }
                ret.append(r)

        return ret, cou, offset

    def get_reference(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_reference ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_reference ", "*"*10)
        filters = kwargs.get('filters')
        ret, cou, offset = self._create_ref_sql(filters)
        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"pos": offset, "total_count": cou, "data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
                  }
        return answer



    def get_products(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_products ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_products ", "*"*10)
        filters = kwargs.get('filters')
        offset = filters.get('start', 0)
        count = filters.get('count', 17)
        try:
            field = filters['sort']['id']
            direction = filters['sort']['dir']
        except:
            field = 'c_name'
            direction = 'asc'

        where = self._set_where_prod_sel(filters.get('filters'))

        order = f"""\norder by rp.{field} {direction} \n"""

        limits = f"""limit {count} offset {offset}"""

        sql = """select rp.c_id, c_nnt, rp.c_name, rp.c_namefull, rv.c_name, rp.c_inprice
from ref_products rp
join ref_vats rv on (rp.c_vatid=rv.c_id)
"""
        sql_count = f"""select count(*) from ({sql+where}) as ccc"""
        sql += where + order + limits
        self._print(sql)
        rows = self._request(sql) or []
        cou = self._request(sql_count)
        t1 = time.time() - t
        ret = []
        if cou:
            cou = cou[0][0]
        else:
            cou = 0
        for row in rows:
            r = {
                "id": str(row[0]),
                "c_id": str(row[0]),
                "c_code": row[1],
                "c_name": row[2],
                "c_namefull": row[3],
                "c_vat": row[4],
                "c_inprice": row[5]
            }
            ret.append(r)
        t2 = time.time() - t1 - t
        answer = {"pos": offset, "total_count": cou, "data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
                  }
        return answer


    def get_product_filters(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_product_filters ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_product_filters ", "*"*10)
        c_name = kwargs.get('filterName')
        rows = []
        ret = []
        tables = {
            "c_aaid": "ref_application_areas",
            "c_catid": "ref_categories",
            "c_dirid": "ref_directions",
            "c_doseid": "ref_dosages",
            "c_gpid": "ref_groups",
            # "c_gvnls": "2"
            "c_mancid": "ref_countries",
            "c_manid": "ref_manufacturers",
            "c_megaid": "ref_megacategories",
            "c_mnnid": "ref_mnns",
            # c_nnt: ""
            "c_ppid": "ref_packagings",
            "c_psid": "ref_packagings",
            "c_ptid": "ref_packagings",
            "c_rfid": "ref_release_forms",
            "c_speid": "ref_spes",
            # c_type: "2"
            "c_vatid": "ref_vats"
        }
        if c_name:
            if c_name == 'c_mnnid':
                sql_ref = f"""select c_rusname, c_id from {tables[c_name]}
order by 1, 2"""
            else:
                sql_ref = f"""select c_name, c_id from {tables[c_name]}
order by 1, 2"""

        else:
            sql_ref = f"""select 1, 2;"""
            rows = self._request(sql)
        t1 = time.time() - t

        rows = self._request(sql_ref)
        for c, row in enumerate(rows, 1):
            r = {
                "value": row[0],
                "id": str(row[1])
            }
            ret.append(r)

        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

    def get_ref_filters(self, *args, **kwargs):
        t = time.time()
        self._print("*"*10, " get_product_filters ", "*"*10)
        self._print(args)
        self._print(kwargs)
        self._print("*"*10, " get_product_filters ", "*"*10)
        reference = kwargs.get('reference')
        if reference == 'Контрагенты': reference = "partners"
        if reference in ["partners", "points"]:
            pref = "n"
        else:
            pref = "c"
        tables = {
            "partners": "ref_partners_types",
            "spes": "ref_categories",
            "groups": "ref_groups",
            "appareas": "ref_application_areas",
            "points": "ref_partners"
        }
        rows = []
        ret = []
        if reference:
            if reference == "points":
                sql_ref = f"""select r.{pref}_id, r.{pref}_name from
{tables[reference]} r
left join ref_partners_types rpt on (r.n_type = rpt.n_id)
where rpt.n_name != 'Точка'
order by 1, 2
"""
            else:
                sql_ref = f"""select r.{pref}_id, r.{pref}_name from
{tables[reference]} r order by 1, 2
"""
        else:
            sql_ref = f"""select 1, 2;"""
            rows = self._request(sql)
        t1 = time.time() - t
        rows = self._request(sql_ref)
        for c, row in enumerate(rows, 1):
            r = {
                "id": str(row[0]),
                "value": row[1],
            }
            ret.append(r)

        t2 = time.time() - t1 - t
        answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer

if __name__ == "__main__":

    # s = SKLAD()
    sql = """select n_id, n_title, n_value
from service_fields_translates
order by n_id"""
    rpc = botclient.BOTProxy('dbbot.test', ('127.0.0.1', 4222))
    q = rpc('fdb.execute', sync=(1, 7))('ms/new_sklad_test', sql)

    self._print(q)
    # self._print(s)

    # q = s.get_new_id()

    # self._print(q)
    # self._print(s.get_new_id())
    # self._print(s.get_new_id())
    # self._print(s.get_new_id())


#вставка bodies по id накладных
row = [11111,]
sql = f"""insert into journals_arrivals_bodies (n_doc_id, n_product)
SELECT
{row[0]}::bigint,
('{{"n_product":' ||  r_prod || ', "n_code":' || (substring(r_prod::text from 10 for 20))::text || ', "n_unit": "шт.",
   "n_amount":' || r_am || ', "n_price":' || r_price || ', "n_novats_summ":' || r_am * r_price || ',
   "n_vats_base":' || r_vat || ', "n_vats_summ":' || round(r_am*r_price*r_vat/100) || ',
   "n_total_summ":'|| r_am*r_price + round(r_am*r_price*r_vat/100) || '}}')::jsonb
FROM generate_series(1, 1 + (random()*10)::int) as l   -- number of times
CROSS JOIN LATERAL (select l.l * 0 + c_id as r_prod from ref_products order by random() limit 1) AS t1
CROSS JOIN LATERAL ( select (l.l*0 + 1 + (random()*10)::integer)::int as r_am) as t2
CROSS JOIN LATERAL ( select (l.l*0 + 150 + (random()*10000)::integer)::int as r_price) as t3
CROSS JOIN LATERAL (select l.l * 0 + c_vat as r_vat from ref_vats order by random() limit 1) AS t4
"""
#апдейт сумм
sql = """update journals_arrivals_headers jah
set n_nds = (select sum((jab.n_product->'n_vats_summ')::numeric) from journals_arrivals_bodies jab
where jab.n_doc_id = jah.n_id)
"""


