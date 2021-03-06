# coding: utf-8

import os
import sys
import time
import json
import atexit
import datetime
import tempfile
import zipfile
import shutil
import base64
import zipimport
import traceback


from relatorio.templates.opendocument import Template

from xml.sax.saxutils import escape


class Invoice(dict):

    pass
    # @property
    # def total(self):
        # return sum(l['item']['amount'] for l in self['lines'])

class Shipment(Invoice):

    doc_template = 'shipment_short.ods'


class Movement(Invoice):

    doc_template = 'movement_short.ods'


class Arrival(Invoice):

    doc_template = 'arrival_short.ods'


class Rest(Invoice):

    doc_template = 'rest_short.ods'

class Balance(Invoice):

    doc_template = 'balance.ods'

class Prod_movements(Invoice):

    doc_template = 'products_movements.ods'


class REPORT:

    def __init__(self, parent):
        self.parent = parent
        # _of = tempfile.NamedTemporaryFile(prefix='esc.', suffix=".print", delete=False)
        self.temp_dir = tempfile.TemporaryDirectory(prefix='report_generator_')
        self.temp_dir = self.temp_dir.name
        # print(self.temp_dir)
        # atexit.register(self._at_exit)

    def at_exit(self):
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

    def generate_test(self, *args, **kwargs):

        self.parent._print("*"*10, " generate_test ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " generate_test ", "*"*10)

        # doc_type = 'arrival'
        # kwargs['doc_type'] = doc_type
        self.generate(*args, **kwargs)

        answer = {"params": args,
            "kwargs": kwargs, "timing": {"sql": 0, "process": 0},
        }
        return answer


    def _generate_short_arrival(self, doc_number):

        self.parent._print(doc_number)
        data = {}
        sql = f"""select
jah.n_number as doc_number,
jah.n_base as doc_base,
jah.n_executor as doc_employ,
rps.n_name as doc_suppl,
jah.n_pos_numbers as doc_positions,
jah.n_summ as doc_total,
jah.n_dt_invoice as doc_date,
rpc.n_name as rec_name,
rpr.c_name as pos_prod_name,
jab.n_product->'n_unit' as pos_unit,
jab.n_product->'n_amount' as pos_kol,
jab.n_product->'n_total_summ' as pos_total,
(jab.n_product->'n_total_summ')::int / (jab.n_product->'n_amount')::int as pos_price
-- ,jrb.n_product
from journals_arrivals_headers jah
join ref_partners rpc on rpc.n_id = jah.n_recipient
join ref_partners rps on rps.n_id = jah.n_supplier
join journals_arrivals_bodies jab ON jab.n_doc_id = jah.n_id and jab.n_deleted = false
join ref_products rpr on (rpr.c_id=(jab.n_product->'n_product')::bigint)
where jah.n_id = '{doc_number}'::bigint
order by jab.n_id"""
        res = self.parent._request(sql)
        if res:
            data = {
                'number': res[0][0],
                'date': res[0][6],
                'retailer': {
                    'name': res[0][3]
                },
                'customer': {
                    'name': res[0][7],
                    'storage': res[0][7],
                },
                'lines': [],
                'total': self._gen_price(res[0][5]),
                'total_text': '--'
            }
            for i, row in enumerate(res, 1):
                r = {'item': {
                    'pos': i,
                    'name': row[8],
                    'unit': row[9],
                    'price': self._gen_price(row[12]),
                    'quantity': row[10],
                    'amount': self._gen_price(row[11])
                    }
                }
                data['lines'].append(r)
        return data

    def _generate_short_rest(self, doc_number):

        self.parent._print(doc_number)
        data = {}
        sql = f"""select
jrh.n_number as doc_number,
jrh.n_base as doc_base,
jrh.n_executor as doc_employ,
jrh.n_pos_numbers as doc_positions,
jrh.n_summ as doc_total,
jrh.n_dt_invoice as doc_date,
rp.n_name as rec_name,
rpr.c_name as pos_prod_name,
jrb.n_product->'n_unit' as pos_unit,
jrb.n_product->'n_amount' as pos_kol,
jrb.n_product->'n_total_summ' as pos_total,
(jrb.n_product->'n_total_summ')::int / (jrb.n_product->'n_amount')::int as pos_price
-- ,jrb.n_product
from journals_rests_headers jrh
join ref_partners rp on rp.n_id = jrh.n_recipient
join journals_rests_bodies jrb ON jrb.n_doc_id = jrh.n_id and jrb.n_deleted = false
join ref_products rpr on (rpr.c_id=(jrb.n_product->'n_product')::bigint)
where jrh.n_id = '{doc_number}'::bigint
order by jrb.n_id
        """
        res = self.parent._request(sql)
        if res:
            data = {
                'number': res[0][0],
                'date': res[0][5],
                'customer': {
                    'storage': res[0][6],
                },
                'lines': [],
                'total': self._gen_price(res[0][4]),
                'total_text': '--'
            }
            for i, row in enumerate(res, 1):
                r = {'item': {
                    'pos': i,
                    'name': row[7],
                    'unit': row[8],
                    'price': self._gen_price(row[11]),
                    'quantity': row[9],
                    'amount': self._gen_price(row[10])}
                }
                data['lines'].append(r)

        return data

    def _gen_price(self, price):
        price = str(price)
        return price[:-2] + ',' + price[-2:]

    def _generate_balance(self):

        sql = f"""select rp.c_name as name,
rp.c_nnt as t_code,
max(jpb.n_price) as price,
sum(jpb.n_quantity) as kol,
jpb.n_product_id as pr_id

from journals_products_balance jpb
join ref_products rp ON rp.c_id = jpb.n_product_id and (jpb.n_quantity != 0 and jpb.n_quantity is not null)
group by 1, 2,  5
order by 1 """
        res = self.parent._request(sql)
        if not res:
            res = self.parent._request(sql_old)
        if res:
            data = {
                'lines': [],
                'total_amount': '',
                'total_summ': '',
                'total_pos': len(res)
            }
            for i, row in enumerate(res, 1):
                p = row[2]*row[3]
                r = {'item': {
                    'pos': i,
                    'name': row[0],
                    'code': row[1],
                    'price': f"""{str(row[2])[:-2]},{str(row[2])[-2:]}""",
                    'amount': row[3],
                    'summ': f"""{str(p)[:-2]},{str(p)[-2:]}"""
                    }
                }
                data['lines'].append(r)
            ta = sum([ i['item']['amount'] for i in data['lines']])
            ts = sum([ i[2]*i[3] for i in res])
            data['total_amount'] = ta
            data['total_summ'] = f"""{str(ts)[:-2]},{str(ts)[-2:]}"""
        return data

    def _generate_short_movement(self, doc_number):
        self.parent._print(doc_number)
        data = {}
        sql_old = f"""select
jmh.n_number as doc_number,
jmh.n_base as doc_base,
jmh.n_executor as doc_employ,
rps.n_name as doc_suppl,
jmh.n_pos_numbers as doc_positions,
jmh.n_summ as doc_sell_total,
(jmh.n_summ::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int  as doc_prih_total,
jmh.n_dt_invoice as doc_date,
rpc.n_name as doc_rec_name,
j1.name as pos_prod_name,
jmb.n_product->'n_unit' as pos_unit,
jmb.n_product->'n_amount' as pos_kol,
case
	when (jmb.n_product->'n_amount')::int > 0
	then (jmb.n_product->'n_total_summ')::int /(jmb.n_product->'n_amount')::int
	else 0
end as pos_sale_price,
jmb.n_product->'n_total_summ' as pos_sale_total,
jpb.n_consignment as seria,
'' as goden,
case
	when (jmb.n_product->'n_amount')::int > 0
	then ((jmb.n_product->'n_total_summ')::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int / (jmb.n_product->'n_amount')::int
	else 0
end  as pos_prih_price,
((jmb.n_product->'n_total_summ')::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int as pos_prih_total,
rpu.n_name as u_name
from journals_movements_headers jmh
join ref_partners rpc on rpc.n_id = jmh.n_recipient
join ref_partners rps on rps.n_id = jmh.n_supplier
join journals_movements_bodies jmb ON jmb.n_doc_id = jmh.n_id and jmb.n_deleted = false
join journals_products_balance jpb on jpb.n_id = (jmb.n_product->'n_balance_id')::bigint
join (select pb.n_product_id, rp.c_name as name, pb.n_id  as id, pb.n_quantity as stock
 		from journals_products_balance pb
 		join ref_products rp on (rp.c_id=pb.n_product_id)) as j1
 	on (j1.id = (jmb.n_product->'n_balance_id')::bigint)
join ref_partners rpu on rpu.n_id = rpc.n_parent_id
where jmh.n_id = '{doc_number}'::bigint
order by pos_prod_name --jmb.n_id"""
        sql = f"""select
jmh.n_number as doc_number,
jmh.n_base as doc_base,
jmh.n_executor as doc_employ,
rps.n_name as doc_suppl,
jmh.n_pos_numbers as doc_positions,
jmh.n_summ as doc_sell_total,
(jmh.n_summ::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int  as doc_prih_total,
jmh.n_dt_invoice as doc_date,
rpc.n_name as doc_rec_name,
j1.name as pos_prod_name,
jmb.n_product->'n_unit' as pos_unit,
jmb.n_product->'n_amount' as pos_kol,
case
	when (jmb.n_product->'n_amount')::int > 0
	then (jmb.n_product->'n_total_summ')::int /(jmb.n_product->'n_amount')::int
	else 0
end as pos_sale_price,
jmb.n_product->'n_total_summ' as pos_sale_total,
'' as seria, --jpb.n_consignment as seria,
'' as goden,
case
	when (jmb.n_product->'n_amount')::int > 0
	then ((jmb.n_product->'n_total_summ')::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int / (jmb.n_product->'n_amount')::int
	else 0
end  as pos_prih_price,
((jmb.n_product->'n_total_summ')::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int as pos_prih_total,
rpu.n_name as u_name
from journals_movements_headers jmh
join ref_partners rpc on rpc.n_id = jmh.n_recipient
join ref_partners rps on rps.n_id = jmh.n_supplier
join journals_movements_bodies jmb ON jmb.n_doc_id = jmh.n_id and jmb.n_deleted = false
-- join journals_products_balance jpb on jpb.n_id = (jmb.n_product->'n_balance_id')::bigint
join (select d1.n_product_id as n_product_id, rp.c_name as name, d1.stock as stock
	from (select pb.n_product_id as n_product_id, max(pb.n_quantity) as stock
		from journals_products_balance pb
		group by pb.n_product_id) as d1
	join ref_products rp on (rp.c_id=d1.n_product_id)) as j1
 	on (j1.n_product_id = (jmb.n_product->'n_balance_id')::bigint)
join ref_partners rpu on rpu.n_id = rpc.n_parent_id
where jmh.n_id = '{doc_number}'::bigint
order by pos_prod_name --jmb.n_id"""

        res = self.parent._request(sql)
        if not res:
            print(sql_old)
            res = self.parent._request(sql_old)
        else:
            print(sql)
        if res:
            data = {
                'number': res[0][0],
                'date': res[0][7],
                'base': res[0][1],
                'retailer': {
                    'name': res[0][3]
                },
                'customer': {
                    'name': res[0][18],
                    'storage': res[0][8],
                },
                'lines': [],
                'arrival_total': self._gen_price(res[0][6]),
                'sell_total': self._gen_price(res[0][5]),
                'sell_total_text': '--'
            }
            for i, row in enumerate(res, 1):
                r = {'item': {
                    'pos': i,
                    'consignment': row[14],
                    'name': row[9],
                    'unit': row[10],
                    'expired': row[15],
                    'arrival_price': self._gen_price(row[16]),
                    'arrival_amount': self._gen_price(row[17]),
                    'sell_price': self._gen_price(row[12]),
                    'sell_amount': self._gen_price(row[13]),
                    'quantity': row[11],
                    }
                }
                data['lines'].append(r)
        return data


    def _generate_short_shipment(self, doc_number):

        self.parent._print(doc_number)
        data = {}
        sql = f"""select
jsh.n_number as doc_number,
jsh.n_base as doc_base,
jsh.n_executor as doc_employ,
rps.n_name as doc_suppl,
jsh.n_pos_numbers as doc_positions,
jsh.n_summ as doc_sell_total,
(jsh.n_summ::numeric / (1 + (jsb.n_product->'n_charge')::numeric))::int  as doc_prih_total,
jsh.n_dt_invoice as doc_date,
rpc.n_name as doc_rec_name,
j1.name as pos_prod_name,
jsb.n_product->'n_unit' as pos_unit,
jsb.n_product->'n_amount' as pos_kol,
(jsb.n_product->'n_total_summ')::int / (jsb.n_product->'n_amount')::int as pos_sale_price,
jsb.n_product->'n_total_summ' as pos_sale_total,
jpb.n_consignment as seria,
'' as goden,
((jsb.n_product->'n_total_summ')::numeric / (1 + (jsb.n_product->'n_charge')::numeric))::int / (jsb.n_product->'n_amount')::int as pos_prih_price,
((jsb.n_product->'n_total_summ')::numeric / (1 + (jsb.n_product->'n_charge')::numeric))::int as pos_prih_total
from journals_shipments_headers jsh
join ref_partners rpc on rpc.n_id = jsh.n_recipient
join ref_partners rps on rps.n_id = jsh.n_supplier
join journals_shipments_bodies jsb ON jsb.n_doc_id = jsh.n_id and jsb.n_deleted = false
join journals_products_balance jpb on jpb.n_id = (jsb.n_product->'n_balance_id')::bigint
join (select pb.n_product_id, rp.c_name as name, pb.n_id  as id, pb.n_quantity as stock
 		from journals_products_balance pb
 		join ref_products rp on (rp.c_id=pb.n_product_id)) as j1
 	on (j1.id = (jsb.n_product->'n_balance_id')::bigint)
where jsh.n_id = '{doc_number}'::bigint
order by jsb.n_id"""
        res = self.parent._request(sql)
        if res:
            data = {
                'number': res[0][0],
                'date': res[0][7],
                'base': res[0][1],
                'retailer': {
                    'name': res[0][3]
                },
                'customer': {
                    'name': res[0][8],
                    'storage': res[0][8],
                },
                'lines': [],
                'arrival_total': self._gen_price(res[0][6]),
                'sell_total': self._gen_price(res[0][5]),
                'sell_total_text': '--'
            }
            for i, row in enumerate(res, 1):
                r = {'item': {
                    'pos': i,
                    'consignment': row[14],
                    'name':  row[9],
                    'unit': row[10],
                    'expired': row[15],
                    'arrival_price': self._gen_price(row[16]),
                    'arrival_amount': self._gen_price(row[17]),
                    'sell_price': self._gen_price(row[12]),
                    'sell_amount': self._gen_price(row[13]),
                    'quantity': row[11],
                    }
                }
                data['lines'].append(r)
        return data

    def product_movement(self, *args, **kwargs):

        self.parent._print("*"*10, " product_movement ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " product_movement ", "*"*10)

        doc_type = 'products_movements'

        date1 = kwargs.get('date1')
        date2 = kwargs.get('date2')
        arr_fg = kwargs.get('arr_fg')
        dep_fg = kwargs.get('dep_fg')
        item_id = kwargs.get('item_id')

        answer = {"params": args,
            "kwargs": kwargs,
        }

        d_data = []
        a_data = []

        sql_move = f"""select
jmh.n_number as doc_number,
jmh.n_dt_invoice as doc_date,
'' as suppl,
rp.n_name as point,
0,
(jmb.n_product->'n_amount')::text::numeric as amount,
(select c_name from ref_products where c_id = {item_id})
from journals_movements_bodies jmb
join journals_movements_headers jmh on jmb.n_doc_id = jmh.n_id
join ref_partners rp ON rp.n_id = jmh.n_recipient
where (jmb.n_product->'n_balance_id')::text in (select jpb.n_id::text
	from journals_products_balance jpb
	where jpb.n_product_id = {item_id})
and jmb.n_deleted=false
and jmh.n_dt_invoice >= '{date1}'::date
and jmh.n_dt_invoice <= '{date2}'::date
"""

        sql_arr = f"""select
jah.n_number as doc_number,
jah.n_dt_invoice as doc_date,
rp.n_name as suppl,
'' as point,
(jab.n_product->'n_amount')::text::numeric as amount,
0,
(select c_name from ref_products where c_id = {item_id})
from journals_arrivals_bodies jab
join journals_arrivals_headers jah on jab.n_doc_id = jah.n_id
join ref_partners rp ON rp.n_id = jah.n_supplier
where (jab.n_product->'n_product')::text = '{item_id}'
and jab.n_deleted=false
and jah.n_dt_invoice >= '{date1}'::date
and jah.n_dt_invoice <= '{date2}'::date
"""

        sqls = []

        if not arr_fg and not dep_fg:
            return answer

        if arr_fg:
            sqls.append(sql_arr)
        if dep_fg:
            sqls.append(sql_move)
        sqls = '\nunion all\n'.join(sqls)
        sql = f"""select * from (
{sqls}
) as aa
order by doc_date asc, doc_number
        """
        # print(sql)
        a_data = self.parent._request(sql)
        if a_data:
            data = {
                'lines': [],
                'tovar': a_data[0][6],
                'date1': datetime.datetime.strptime(date1, '%Y-%m-%d %H:%M:%S').strftime('%d-%m-%y'),
                'date2': datetime.datetime.strptime(date2, '%Y-%m-%d %H:%M:%S').strftime('%d-%m-%y'),
                'arr_total': 0,
                'dep_total': 0,
            }
            for i, row in enumerate(a_data, 1):

                d = datetime.datetime.strptime(row[1], '%Y-%m-%d')
                r = {'item': {
                    'doc': row[0],
                    'date': d.strftime('%d-%m-%y'),
                    'suppl': row[2],
                    'recip': row[3],
                    'arriv': row[4] or '',
                    'depart': row[5] or ''
                    }
                }
                data['lines'].append(r)
            ta = sum([ int(i['item']['arriv']) if i['item']['arriv']!= '' else 0 for i in data['lines']])
            td = sum([ int(i['item']['depart']) if i['item']['depart']!= '' else 0  for i in data['lines']])
            data['arr_total'] = ta
            data['dep_total'] = td

            inv = Prod_movements(**data)
            zip_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            with zipfile.ZipFile(zip_path, mode='r') as _zf:
                _zf.extract(f'doc_tmpl/{inv.doc_template}', path=self.temp_dir)
            t_path = os.path.join(self.temp_dir, 'doc_tmpl', inv.doc_template)

            basic = Template(source='', filepath=t_path)
            basic_generated = basic.generate(o=inv).render()
            fn = os.path.join(self.temp_dir, self.gen_file_name(doc_type) )
            file_data = basic_generated.getvalue()
            with open(fn, 'wb') as _f:
                _f.write(file_data)

            md5 = self.parent.filesave(fn)

            l_file_name = os.path.basename(fn).replace('.ods', '')

            link_name = f"""https://sklad71.org/filehash/{l_file_name}.pdf?{md5}"""
            print(link_name)
            bi = base64.b64encode(file_data)
            bi = bi.decode()
            # print(bi)
            # print(len(bi))
            answer = {"params": args,
                "kwargs": kwargs, "timing": {"sql": 0, "process": 0},
                "data": {
                    "link": link_name,
                    "file_name": os.path.basename(fn),
                    "binary": bi
                }
            }

        return answer




    def generate(self, *args, **kwargs):

        self.parent._print("*"*10, " generate ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " generate ", "*"*10)

        doc_type = kwargs.get('doc_type')
        doc_number = kwargs.get('doc_number')
        data = kwargs.get('data')
        answer = {"params": args,
            "kwargs": kwargs,
        }

        if doc_type and doc_number and not data:
            #пришел документ и его номер, достаем данные из базы, делаем обработку
            if doc_type == 'shipment':
                doc_gen = Shipment
                data = self._generate_short_shipment(doc_number)
            elif doc_type == 'arrival':
                doc_gen = Arrival
                data = self._generate_short_arrival(doc_number)
            elif doc_type == 'rest':
                doc_gen = Rest
                data = self._generate_short_rest(doc_number)
            elif doc_type == 'movement':
                doc_gen = Movement
                data = self._generate_short_movement(doc_number)
            elif doc_type == 'balance':
                doc_gen = Balance
                data = self._generate_balance()

        if data:
            #есть данные
            inv = doc_gen(**data)
            zip_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            with zipfile.ZipFile(zip_path, mode='r') as _zf:
                _zf.extract(f'doc_tmpl/{inv.doc_template}', path=self.temp_dir)
            t_path = os.path.join(self.temp_dir, 'doc_tmpl', inv.doc_template)

            basic = Template(source='', filepath=t_path)
            basic_generated = basic.generate(o=inv).render()
            fn = os.path.join(self.temp_dir, self.gen_file_name(doc_type) )
            file_data = basic_generated.getvalue()
            with open(fn, 'wb') as _f:
                _f.write(file_data)

            md5 = self.parent.filesave(fn)

            l_file_name = os.path.basename(fn).replace('.ods', '')

            link_name = f"""https://sklad71.org/filehash/{l_file_name}.pdf?{md5}"""
            print(link_name)
            bi = base64.b64encode(file_data)
            bi = bi.decode()
            # print(bi)
            # print(len(bi))
            answer = {"params": args,
                "kwargs": kwargs, "timing": {"sql": 0, "process": 0},
                "data": {
                    "link": link_name,
                    "file_name": os.path.basename(fn),
                    "binary": bi
                }
            }
        return answer



    def gen_file_name(self, name, ext='ods'):

        file_name = name + '_' + datetime.datetime.now().strftime('%Y-%m-%d_%H:%M:%S.%f') + '.' + ext
        file_name = escape(file_name, {':': '-', '/': '_', '\\': '_'})
        return file_name
        # return os.path.abspath(os.path.join(self.task.work_dir, 'static', 'reports', file_name))

    def __call__(self):

        return "report generator"


li = {'item': {
            'pos': 1,
            'name': 'Vodka 70cl',
            'unit': 'шт.',
            'price': 10.34,
            'quantity': 7,
            'amount': 7 * 10.34}
        }

li1 = [
    {'item': {
        'pos': 1,
        'name': 'Vodka 70cl',
        'unit': 'шт.',
        'price': 10.34,
        'quantity': 7,
        'amount': 7 * 10.34}
    },
    {'item': {
        'pos': 2,
        'name': 'Cognac 70cl',
        'unit': 'шт.',
        'price': 13.46,
        'quantity': 12,
        'amount': 12 * 13.46}
    },
    {'item': {
        'pos': 3,
        'name': 'Sparkling water 25cl',
        'unit': 'шт.',
        'price': 4,
        'quantity': 1,
        'amount': 4*1}
    },
    {'item': {
        'pos': 4,
        'name': 'Good customer',
        'unit': 'шт.',
        'price': 20,
        'quantity': 1,
        'amount': 20*1}
    },
]

lin = [li for i in range(50)]
li1.extend(lin)
total = sum(l['item']['amount'] for l in li1)

DATA = {
       'number':'1212',
        'date':'01.01.2020',
        'retailer': {
            'name': 'Поставщик'
        },
        'customer': {
            'name': 'Покупатель',
            'storage': 'Точка 1',
        },
        'lines': li1,
        'total': total,
        'total_text': 'итого прописью'
    }


if __name__ == "__main__":


    r = REPORT('parent')
    doc_type = 'arrival'
    r.generate(doc_type=doc_type, data=DATA)
    pass


