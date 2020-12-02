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


    def _generate_short_movement(self, doc_number):
        self.parent._print(doc_number)
        data = {}
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
(jmb.n_product->'n_total_summ')::int / (jmb.n_product->'n_amount')::int as pos_sale_price,
jmb.n_product->'n_total_summ' as pos_sale_total,
jpb.n_consignment as seria,
'' as goden,
((jmb.n_product->'n_total_summ')::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int / (jmb.n_product->'n_amount')::int as pos_prih_price,
((jmb.n_product->'n_total_summ')::numeric / (1 + (jmb.n_product->'n_charge')::numeric))::int as pos_prih_total
from journals_movements_headers jmh
join ref_partners rpc on rpc.n_id = jmh.n_recipient
join ref_partners rps on rps.n_id = jmh.n_supplier
join journals_movements_bodies jmb ON jmb.n_doc_id = jmh.n_id and jmb.n_deleted = false
join journals_products_balance jpb on jpb.n_id = (jmb.n_product->'n_balance_id')::bigint
join (select pb.n_product_id, rp.c_name as name, pb.n_id  as id, pb.n_quantity as stock
 		from journals_products_balance pb
 		join ref_products rp on (rp.c_id=pb.n_product_id)) as j1
 	on (j1.id = (jmb.n_product->'n_balance_id')::bigint)
where jmh.n_id = '{doc_number}'::bigint
order by jmb.n_id"""
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


